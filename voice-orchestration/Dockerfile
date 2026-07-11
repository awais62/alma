FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Pipecat LiveKit agent listens on no port itself —
# it connects outbound to the LiveKit server.
CMD ["python", "main.py"]
