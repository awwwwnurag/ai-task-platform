import os
import json
import time
import redis
from pymongo import MongoClient
from dotenv import load_dotenv

# Load env variables from backend .env
load_dotenv(dotenv_path='../.env')

# Connect to Redis
redis_url = os.getenv("REDIS_URL")
if redis_url:
    # Upstash natively uses rediss:// format which handles SSL and passwords structurally
    redis_client = redis.Redis.from_url(redis_url, decode_responses=True)
else:
    redis_client = redis.Redis(
        host=os.getenv("REDIS_HOST", "127.0.0.1"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        password=os.getenv("REDIS_PASSWORD", None),
        decode_responses=True
    )

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/ai-tasks")
mongo_client = MongoClient(mongo_uri)
db = mongo_client.get_database()
tasks_collection = db.tasks

def process_task(task_data):
    try:
        task_id = task_data.get("taskId")
        from bson.objectid import ObjectId
        
        # 1. Update status to 'running'
        task = tasks_collection.find_one_and_update(
            {"_id": ObjectId(task_id)},
            {"$set": {"status": "running"}, "$push": {"logs": "Worker picked up task"}},
            return_document=True
        )
        
        if not task:
            print(f"Task {task_id} not found in DB")
            return
            
        print(f"Processing task: {task_id} - Operation: {task['operation']}")
        
        input_text = task.get("input_text", "")
        operation = task.get("operation")
        
        # 2. Execute operation
        result = None
        logs = ["Executing operation: " + operation]
        
        if operation == "uppercase":
            result = input_text.upper()
        elif operation == "lowercase":
            result = input_text.lower()
        elif operation == "reverse string":
            result = input_text[::-1]
        elif operation == "word count":
            result = len(input_text.split())
        elif operation == "ai_prompt":
            agent = task.get("agent", "openai")
            prompt = input_text
            
            if agent == "openai":
                api_key = os.getenv("OPENAI_API_KEY")
                if not api_key:
                    raise ValueError("OPENAI_API_KEY is missing. Please add it to your .env file.")
                from openai import OpenAI
                client = OpenAI(api_key=api_key)
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=500
                )
                result = response.choices[0].message.content
                
            elif agent == "anthropic":
                api_key = os.getenv("ANTHROPIC_API_KEY")
                if not api_key:
                    raise ValueError("ANTHROPIC_API_KEY is missing. Please add it to your .env file.")
                from anthropic import Anthropic
                client = Anthropic(api_key=api_key)
                response = client.messages.create(
                    model="claude-3-haiku-20240307",
                    max_tokens=500,
                    messages=[{"role": "user", "content": prompt}]
                )
                result = response.content[0].text
                
            elif agent == "gemini":
                api_key = os.getenv("GEMINI_API_KEY")
                if not api_key:
                    raise ValueError("GEMINI_API_KEY is missing. Please add it to your .env file.")
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
                result = response.text
                
            elif agent == "llama3":
                api_key = os.getenv("GROQ_API_KEY")
                if not api_key:
                    raise ValueError("GROQ_API_KEY is missing (using Groq for Llama 3). Please add it to your .env file.")
                from groq import Groq
                client = Groq(api_key=api_key)
                response = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama3-8b-8192",
                    max_tokens=500
                )
                result = response.choices[0].message.content
            else:
                raise ValueError(f"Unknown AI agent: {agent}")
        else:
            raise ValueError(f"Unknown operation: {operation}")
            
        logs.append(f"Operation completed successfully. Result: {result}")
        
        # 3. Transition status to 'success', save result and logs
        tasks_collection.update_one(
            {"_id": ObjectId(task_id)},
            {
                "$set": {
                    "status": "success",
                    "result": result
                },
                "$push": {"logs": {"$each": logs}}
            }
        )
        print(f"Task {task_id} completed successfully.")
        
    except Exception as e:
        print(f"Error processing task: {e}")
        try:
            tasks_collection.update_one(
                {"_id": ObjectId(task_id)},
                {
                    "$set": {"status": "failed"},
                    "$push": {"logs": f"Error: {str(e)}"}
                }
            )
        except Exception as inner_e:
            print(f"Failed to update task to failed state: {inner_e}")

import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

def run_dummy_server():
    port = int(os.environ.get("PORT", 8080))
    class DummyHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Worker is running")
    try:
        server = HTTPServer(('0.0.0.0', port), DummyHandler)
        server.serve_forever()
    except OSError as e:
        print(f"Dummy server skipped: {e} (Expected during local development if port is busy)")

def main():
    print("Python Worker started. Listening on 'ai-task-queue'...")
    while True:
        try:
            # BLPOP blocks until an item is available. Timeout 0 means wait forever
            # It returns a tuple: (queue_name, item)
            queue_name, item = redis_client.blpop("ai-task-queue", 0)
            task_data = json.loads(item)
            process_task(task_data)
        except Exception as e:
            print(f"Worker iteration error: {e}")
            time.sleep(1)

if __name__ == "__main__":
    threading.Thread(target=run_dummy_server, daemon=True).start()
    main()
