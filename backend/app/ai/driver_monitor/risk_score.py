def calculate_risk(state, perclos_data, phone_usage=False, looking_away=False):
    score = 0
    alerts = []

    if phone_usage:
        score += 35
        alerts.append("Phone usage detected")
        
    if looking_away:
        score += 15
        alerts.append("Driver looking away")
        
    perclos_val = perclos_data.get("perclos", 0)
    if perclos_val > 15:
        score += int(perclos_val)
        alerts.append("Driver fatigued")
        
    if state.yawn_count > 5:
        score += 10
        
    # Cap risk score at 100
    score = min(score, 100)
    
    # Calculate attention score (100 - risk elements)
    attention = 100 - (perclos_val * 1.5) - (20 if phone_usage else 0) - (15 if looking_away else 0)
    attention = max(0, min(100, attention))
    state.attention_score = round(attention, 1)

    return {
        "risk_score": score,
        "attention_score": state.attention_score,
        "alerts": alerts
    }