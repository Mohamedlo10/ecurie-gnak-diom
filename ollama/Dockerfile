FROM ollama/ollama

# Pré-télécharge le modèle DeepSeek (ou tout autre modèle supporté)
RUN ollama pull deepseek-r1:1.5b

EXPOSE 11434

CMD ["ollama", "serve"]
