def calculate_risk(phone_usage=False):
    score = 0
    alerts = []

    if phone_usage:
        score += 35
        alerts.append("Phone usage detected")

    return {
        "risk_score": score,
        "alerts": alerts
    }