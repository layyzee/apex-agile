#!/bin/bash
# Apex Agile — High-Performance Local-First Jira Alternative
# Built for Scrum Masters & Agile Delivery Leads

PORT=3004
echo "⚡ Starting Apex Agile on http://localhost:$PORT ..."

# Check if port is in use and kill previous instance if needed
PID=$(lsof -ti :$PORT)
if [ ! -z "$PID" ]; then
  echo "⚠️ Port $PORT is occupied by PID $PID. Freeing port..."
  kill -9 $PID
fi

cd "$(dirname "$0")"
npm run dev
