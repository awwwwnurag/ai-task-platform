import os
import json
import time
import redis
from pymongo import MongoClient
from dotenv import load_dotenv

# Load env variables from backend .env
load_dotenv(dotenv_path='../.env')

# Connect to Redis
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "127.0.0.1"),
    port=int(os.getenv("REDIS_PORT", 6379)),
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
    main()
