import os
import sys
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.services.smart_ingestor import SmartIngestor

def run():
    db = SessionLocal()
    ingestor = SmartIngestor(db)
    
    print("--- CrackSarkar: Zero-Effort Smart Ingestion ---")
    print(f"Reading from: {os.path.abspath(ingestor.raw_dir)}")
    
    results = ingestor.run_ingestion()
    
    if results["status"] == "success":
        print("\n🏆 Smart Ingestion Complete!")
        print(f"✅ Matched Topics: {results['matched']}")
        print("\nYour 'Study' page is now updated with the GPT-cleaned text!")
    else:
        print(f"\n❌ Error: {results['message']}")
        
    db.close()

if __name__ == "__main__":
    run()
