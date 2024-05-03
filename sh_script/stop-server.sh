PID=$(pgrep -f "npm start")

if [ -n "$PID" ]; then
    # Beende den Prozess
    kill $PID
    echo "Prozess wurde beendet."
else
    echo "Prozess läuft nicht."
fi
