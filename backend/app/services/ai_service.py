from typing import Dict, Optional

class AIService:
    # A knowledge base of bilingual (English + Telugu) simplifications for CrackSarkar Group II Syllabus
    KNOWLEDGE_BASE = {
        "c-art12": {
            "english": {
                "simplified": "Article 12 defines what 'The State' means in the context of our Fundamental Rights. It's not just the central government; it includes almost any authority that has public power—like your local electricity board (TSSPDCL) or a village panchayat.",
                "mnemonic": "ST-A-T-E: Standard, Tribal, Administrative, and Territorial Entities."
            },
            "telugu": {
                "simplified": "ఆర్టికల్ 12 మన ప్రాథమిక హక్కుల విషయంలో 'రాష్ట్రం' అంటే ఏమిటో వివరిస్తుంది. ఇది కేవలం కేంద్ర ప్రభుత్వం మాత్రమే కాదు; ప్రభుత్వం కింద పనిచేసే ప్రతి అధికారం (ఉదాహరణకు: మీ గ్రామ పంచాయతీ లేదా విద్యుత్ శాఖ) రాష్ట్రంగా పరిగణించబడుతుంది.",
                "mnemonic": "రాష్ట్రం = కేంద్రం + రాష్ట్రం + స్థానిక సంస్థలు + ఇతర అధికారులు."
            }
        },
        "c-art13": {
            "english": {
                "simplified": "Article 13 acts like a 'Protector' of your rights. It says that any law made by the government that takes away your fundamental rights will be considered 'dead' or void. This is where the Supreme Court gets its power to review laws.",
                "mnemonic": "13 = Shield against bad laws (Lucky for Citizens, Unlucky for bad laws)."
            },
            "telugu": {
                "simplified": "ఆర్టికల్ 13 మన హక్కులకు ఒక 'రక్షకుడిలా' పనిచేస్తుంది. ప్రభుత్వం చేసే ఏ చట్టమైనా మన ప్రాథమిక హక్కులను హరిస్తే, ఆ చట్టం చెల్లదు అని ఇది చెబుతుంది. దీని ద్వారానే సుప్రీం కోర్టుకు చట్టాలను సమీక్షించే అధికారం లభిస్తుంది.",
                "mnemonic": "13 = చెడ్డ చట్టాలను అడ్డుకునే కవచం."
            }
        },
        "c-art14": {
            "english": {
                "simplified": "Article 14 ensures that the law is the same for everyone. Whether you are a common man or a high official, you are equal before the law. However, 'Reasonable Classification' is allowed to help the disadvantaged—like giving women or children special protections.",
                "mnemonic": "14 = Equality for All (All are equal in the eyes of the law)."
            },
            "telugu": {
                "simplified": "ఆర్టికల్ 14 ప్రతి ఒక్కరికి చట్టం ముందు సమానత్వాన్ని అందిస్తుంది. మీరు సామాన్య పౌరుడైనా లేదా ఉన్నత అధికారి అయినా, చట్టం దృష్టిలో అందరూ సమానులే. అయితే, మహిళా లేదా పిల్లల వంటి వెనుకబడిన వర్గాలకు ప్రత్యేక రక్షణ ఇవ్వడం రాజ్యాంగ వ్యతిరేకం కాదు.",
                "mnemonic": "14 = చట్టం ముందు అందరూ సమానం."
            }
        }
    }

    @staticmethod
    def get_concept_explanation(concept_id: str):
        # Always return bilingual content
        data = AIService.KNOWLEDGE_BASE.get(concept_id)
        if data:
            return data
        
        # Generic fallback if concept doesn't exist in KB
        return {
            "english": {
                "simplified": "This concept covers an essential part of the CrackSarkar syllabus. Focus on historical context and its impact on the modern administration of Telangana.",
                "mnemonic": "No mnemonic available for this topic yet."
            },
            "telugu": {
                "simplified": "ఈ అంశం టీఎస్‌పీఎస్‌సీ (CrackSarkar) సిలబస్‌లో ముఖ్యమైన భాగం. దీని యొక్క చారిత్రక నేపథ్యం మరియు తెలంగాణ పరిపాలనపై దీని ప్రభావంపై దృష్టి పెట్టండి.",
                "mnemonic": "ఈ అంశానికి సంబంధించి ప్రస్తుతం ఎలాంటి చిట్కా అందుబాటులో లేదు."
            }
        }
