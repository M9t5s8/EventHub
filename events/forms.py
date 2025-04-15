from django import forms
from eventmodule.models import Ticket

class TicketStatusForm(forms.ModelForm):
    class Meta:
        model = Ticket
        fields = ['status'] 
