from eventmodule.models import EventRating
from django.db.models import Avg

def get_average_rating(event):
    ratings = EventRating.objects.filter(event=event)
    
   
    if ratings.exists():
        average_rating = ratings.aggregate(Avg('rating'))['rating__avg']
    else:
        average_rating = 0

    total_ratings = ratings.count()
    return average_rating, total_ratings