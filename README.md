# SnapNest

React Native projekt za vajo na faksu, samo da sem se malo preveč vživel.

## Kaj dela

- registracija uporabnika
- prijava in odjava
- javni feed slik brez prijave
- feed prijavljenega uporabnika
- objava slike iz kamere ali galerije
- naslov in opis objave
- shranjevanje slike v Supabase Storage
- shranjevanje objav v Supabase PostgreSQL
- opcijsko shranjevanje GPS lokacije pri objavi
- like / dislike sistem
- komentiranje objav
- prikaz podrobnosti objave
- urejanje profila
- avatar uporabnika
- bio uporabnika
- statistika profila:
  - število objav
  - število prejetih všečkov
  - število komentarjev
- shranjevanje priljubljenih objav
- offline prikaz priljubljenih objav z AsyncStorage
- priprava push notifications:
  - zahteva dovoljenje
  - pridobi Expo push token
  - shrani token v Supabase

## Tech

- React Native
- Expo SDK 54
- Supabase

