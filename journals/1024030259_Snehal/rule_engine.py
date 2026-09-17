def check_budget(spending, budget):
    if spending > budget:
        return "Warning: Budget exceeded"
    return "Budget within limit"


def check_spending_increase(previous, current):
    if previous == 0:
        return "No previous data"

    increase = ((current - previous) / previous) * 100

    if increase > 20:
        return "Alert: Spending increased significantly"

    return "Spending is normal"


def check_goal_probability(probability):
    if probability < 70:
        return "Recommendation: Increase savings"

    return "Goal progress is on track"
