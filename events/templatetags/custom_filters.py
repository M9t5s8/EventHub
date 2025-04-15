from django import template
from django.utils.timesince import timesince
from datetime import datetime
from django.utils import timezone
register = template.Library()

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)



@register.filter(name='range_filter')
def range_filter(value):
    return range(1, int(value) + 1)


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

@register.filter
def multiply(value, arg):
    try:
        return float(value) * float(arg)
    except (TypeError, ValueError):
        return 0




@register.filter
def custom_timesince(value):
    if value:
        
        now = timezone.localtime(timezone.now()) 
        value = timezone.localtime(value)

       
        delta = now - value
        seconds = delta.total_seconds()

       
        if seconds < 60:
            return "Just now"

        
        if seconds < 3600: 
            minutes = int(seconds // 60)
            return f"{minutes} min ago"

        if seconds < 86400: 
            hours = int(seconds // 3600)
            return f"{hours} hr ago" if hours == 1 else f"{hours} hrs ago"
        
        if seconds < 2592000: 
            days = int(seconds // 86400) 
            return f"{days} day ago" if days == 1 else f"{days} days ago"

        
        if seconds < 31536000: 
            months = int(seconds // 2592000)
            return f"{months} mon ago" if months == 1 else f"{months} mons ago"

        
        if seconds >= 31536000: 
            years = int(seconds // 31536000) 
            return f"{years} yr ago" if years == 1 else f"{years} yrs ago"

       
        return timesince(value)
    return ''
