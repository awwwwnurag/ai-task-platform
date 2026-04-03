# Build stage
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# Runtime stage
FROM python:3.11-slim
WORKDIR /app
# Create non-root user
RUN addgroup --system appgroup && adduser --system --group appuser
# Copy wheels from builder
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache /wheels/*

COPY . .
RUN chown -R appuser:appgroup /app
USER appuser
CMD ["python", "worker.py"]
