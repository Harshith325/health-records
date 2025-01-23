import sys
import json
from transformers import pipeline

def generate_summary(prescriptions):
    # Initialize the Hugging Face summarization pipeline
    summarizer = pipeline("summarization", model="t5-small")
    
    # Combine all prescriptions into a single text
    text = " ".join([
        f"Notes: {prescription['Notes']}  Medications: {prescription['Medications']}."
        for prescription in prescriptions
    ])

    # Generate the summary
    summary = summarizer(text, max_length=1000,  do_sample=False)
    return summary[0]["summary_text"]

if __name__ == "__main__":
    input_data = sys.stdin.read()
    prescriptions = json.loads(input_data)
    summary = generate_summary(prescriptions)
    print(summary)

