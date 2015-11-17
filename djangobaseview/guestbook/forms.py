from django import forms


class SignForm(forms.Form):
	guestbook_name = forms.CharField(
		label='Guestbook name',
		max_length=50
	)
	guestbook_mesage = forms.CharField(
		widget=forms.Textarea,
		label='Guestkook mesage',
		max_length=100
	)


class EditForm(forms.Form):
	guestbook_name = forms.CharField(
		widget=forms.HiddenInput(),
		label='Guestbook name',
		max_length=50
	)
	greeting_id = forms.IntegerField(
		widget=forms.HiddenInput(),
		label='Greeeting id ',
	)
	guestbook_mesage = forms.CharField(
		widget=forms.Textarea,
		label='Guestkook mesage',
		max_length=100
	)


class DeleteForm(forms.Form):
	guestbook_name = forms.CharField(
		widget=forms.HiddenInput(),
		label='Guestbook name',
		max_length=50
	)
	greeting_id = forms.IntegerField(
		widget=forms.HiddenInput(),
		label='Greeeting id ',
	)

