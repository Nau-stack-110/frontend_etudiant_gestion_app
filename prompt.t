je veux afficher dans cette page les listes des frais scolarités via 
mon url (http://localhost:8000/api/frais-scolarite/)

les données reçues ressemblent à ceci: 
    {
        "id": 5,
        "etudiant": 3,
        "annee_academique": 1,
        "annee_academique_nom": "2024-2025",
        "designation": 1,
        "designation_nom": "Tranche 1",
        "montant_paye": "59692.00",
        "methode_paiement": "BOA",
        "reference": "TRV-MA-Ref",
        "date_de_paiement": "2025-04-18T10:04:21.599786Z"
    }
L'etudiant venant de l'url (http://localhost:8000/api/etudiants/)
les données reçues ressemblent à ceci:
    {
        "id": 3,
        "matricule": "7001",
        "etudiant_email": "Valerie@gmail.com",
        "nom": "SABRINNAH",
        "prenom": "Valerie",
        "mention": 4,
        "mention_nom": "Gestion",
        "parcours": 11,
        "parcours_nom": "Marketing et Communication",
        "date_de_naissance": "2004-12-01",
        "adresse": "Antsirabe",
        "niveau": 1,
        "niveau_nom": "L1",
        "tel": "0389999999",
        "qr_code": "iVBORw0KGgoAAAANSUhEUgAAA1IAAANSAQAAAABHXcKqAAAK7ElEQVR4nO2dT27jTA7FH8cCeikD3wFyFPkGc6SgjzQ3kI6SG0jLABY4iyoWX8kBZjPpBipPC3eckvVDGwjBP4+kOf7Utf3rj6EAscQSSyyxxBJLLLHEEkssscQS66exrF4T7HFMsAdOM7sDZncAOCZgMzMAp5UPbjYB2x3lxR6HGTYzswdOKwc44rkPYv2ZSyyxxPrGy93dsbi7+35z9x3wdXb3dXbH4k/4Oj/Bp7i5r7jVU48XADfHUu5rP7XHr6N+h2KJ9dNYYTd2AMt+cwA393V+Ig1AuQXzE8D8rFalWIsdYVXiKcVkYHbP58luiCXWUKwXu1F/QrgQc3MXgGIo0jyQq7Hs4YOAzIjshlhijcj6wm7caoiCuVqLci3pdDSXpF7hYBSTsQPlY7IbYok1Juslv1GCkPA8qoPh7nRzsREAhzJrniKinYxxZDfEEmtA1mZWCyjvHxPsUX57c3vg5qWesuw3t8cxAcvH1JwJlJvtPU93lBcrVZlShiHWH7nEEkus77smAECKzX27w4D503x7qy8RnQCOA/DtfgO2t/zdab7dUT9R3r6V3EjHGvU7FEusn8ZqwUVUQigpsddKa7mWPUqwLWFaopgak9RMagQ6QMQzym+IJdZgLLIbFxFHpknLfWtkPku6ox3UwCRKLmFpLhIP2Q2xxBqHNdV/5x2G4w7nmOQsEUve7TimEtQ48IQD54Tt7Tn5dt8B4PbEZjcHcBqWS6/tqN+hWGL9NFarp9QII0ok7XTvXBLkLRmsePog+dwozayz6iliiTUY66W0mv5GtQwpImddRhfP1MRHiMRCcd4eqjhFLLEGZPl6mEUbSpWO2+P4FRLQY0IVes3u/vsOmL19mj1CIFrty4cZcPyK35WHutvjL/2/xBJLrG+5OE4BIq0Z8Uf1FKJdhRTn5GDs8ajauJJa0/oJxSliiTUUq4tTSrHkiRSRZ3qCulLWcnbrDEqKRrsAJkyQ7IZYYo3DQvxVP1+a1tbUZeydb1ESGnNroW+KDwBI2UeIPeRviCXWYKyur805B4qm5wJpt5p+ozknFwVYd/CE7IZYYg3N8t8WrSm1JnKWSV2+zp/mv+8A0NKkxVCU1CmK7Lz4IOsxwX/fw+ZsNtXMyU/4DsUS60ewer3o8yVNim7UVzEotfDayc4v0o1yZbQjf0MssQZicV40g5UV8VProw/pRk1tdMN7aoIEaTIyN7JC/SliiTUYC/xnPz/Dj5hZCxYDRfubcfE3OLXRuRrqTxFLrMFYzRQ0IUbLci5UoA0XgryHNml0BWJOYNxHZiQZshtiiTUIq4tTciZ539Na74s0Ru9bkCAszU05cNVTxBJrRBbXYevVzRtuPgOZlhR6tf43mkuc4wXrgfwNscQajNXFKVlKiSpKDtfIFQhpQSL9GZOMW6MsS8xb6lR2QyyxBmG1DpQYxdMikSyR0PAeb6mNFJJSLmNuiY8+yaE4RSyxRmJd533lpgOKRBZ3MigvQc2eGZG4BelvuOyGWGINxoo4JTyKes3pVvTjAPdWlp3bxI7ojO02t7XnzcqLiiXWYCz6O/cmxHidMpxJzxR6sWnJm9EKMhnKKL8hllhDsbpCKcBhRiZCabZwCr1aULOkBfEmHItHuXRfYok1HKtLdXqn8ap1kibv6hvnW6YjbmHBKagzVv6GWGKNxqI67KU6QiN7aBLgDoQ9iKnFbd0BjwTrEyTKb4gl1oiswwzbW22Xd/+YYO97HAAAlo9fPP9ve6tzQ+3dP62sgtzuAICzvsUxwR65SGH071AssX4Kq+1PeU71jx2ALf+pv3YctyeAsyxMMeD2tGU/JwDn5NsdcODmtr05DAB8M8AWB2zxcwKOf6KyMup3KJZYP43FLa4XqSjA44ez2nLtRWmSLxKc1lJKQBSniCXWSCzOhvYSUBrUw6dAmpEcU0ylWs5+sAJMdkMssUZhNb1oN4Bn8ZYSRTMKkeq8zCXOlja2Jd0kDtkNscQaitXFKTsHF0772vZ+cBcArrsgFR/xtFbXpUt2QyyxBmGx7iuLsdRe0ve6NRlY9seDmlkuAzeQn5DdEEuscVhNBxpva6d87njt98POvPKVIhEAFJiQr9J2uMluiCXWKKyuD21moVfuSgk/gtWflCtdEc0s3AR3mUgquyGWWOOwur6THa2A8uShw2xG2PPwS1GFemQjnqFMh+yGWGINwiK7QYOISz4iPYq5H+Y11zxIWpWLaiMOXHVYscQakMV2ow4iRp+ocBJ6UcSSLkkbas57ZOM+9dGLJdZ4rN7fyN1sN8pg0HhzUmOgtcu7975KK8HuAZG/IZZYI7F6fwNAP3YnxV98EHYjD2iIcT+RlCq8shtiiTUIi+ZvXBwHkneVgx00ZiM2Q8acjnrl5oScLyq7IZZYg7Gu2q2u+QSgg5w8TPsgm+QrEySZEr04HbIbYok1CIv1Gy8xCZdDaNNBrbFkzgN4MTdz3x4ruyGWWAOxeH9KueYWWHhO/QNoA1MLW3gjQtOG5nDieqmeIpZYg7E6Qefc7EFqQ/c2DnBOSQbAHa/eFV5XILremnRDdkMssUZi9f2wUTFpTSqeS9sAcHXEM1fa97EsYYLoreyGWGKNxPpy/gZryudOProiW9q8FWO7okr226ebsshuiCXWQCza15ZNKqnnelmYglZZubgks9NnQ0iq/hSxxBqRRd4DDSvnYKV5GelRXA9YgE5DfurMH+VFxRJrMBbrvngAT47sYcV59r7G77h8y5uacgaY+trEEms0Fu+jR4QU4H30l4AjRV0AiUbX8oQvuld2KL8hllhjsWieeXlbMhM0jqO6GjynvOVPqYBSnpbZ1erE8NtRv0OxxPqprGNqFuTTAJxWtq9tZmaP2R3LxwRgfsLsXj9kZhP89/00ey9Zkk/Ddj+trnmLHW72+Gv/L7HEEusbrsyL8jSNmeWjWTbh2YE7pz+/qrZULwNQPUUsscZisc68/O1fkhxkULq1CBmsZA6Uty3xLibZDbHEGooF9gr2zjz00wFTgJ5rmK6rEtByI1RUkX5DLLFGY1Hikv7EuYoS/sZ1eCj5IN300fYoQHZDLLGGZLG/UV7mLK02/Xg6GCT+iiEcZChIBYLWqSK7IZZYg7Eov+G5A6VJvnh4D1mBtBGgYuzF3HQ5VdkNscQahzXlj1bjik/z7e0J394+DQDgAODbfQfKLcc/DuAEMO8Ajnvc8vYEgNOKtdj+Dfj2aIhRv0OxxPppLM5vLCW1kQf9OvnscKPBHKkPe9Jb2qageopYYg3H4unkdfJwbI5up/XOTJNmiLIDaNM5XrQf5aHqTxFLrDFZSyQ57IHTgONX1FgOsyrsOCbUlxBs2KPkMk7rVsOeRjsUauzyl/5fYokl1ndc7FHgRkoOpPqTBpPvcV+fP83BgDnjnLOr8jfEEms8VqY2im+B09z309A0GKwk3wF7zJE1XQFEeeU0e/dPq15G1Gbtwaw/cokllljfeNWU6A5k43w56AcRh4gcSIEob3LMOR0R8lwY8jfEEmsU1tVu0Embq3GZZ86p0xB65fJ6WphCxRfZDbHEGoj1hd3IOYG52qBfDUtSURaWpzI9p/pkH4vshlhijcLiPvoq8mStOBmFdl+eIicB0ir6vcuaSi8qlljDsa71lFpACU3HpWf+uj+F1sDGNLAa3sxtK9Ou/IZYYg3GMv/f9/yfrm3U71AsscQSSyyxxBJLLLHEEkssscT6u6z/AtCQKZHo7ngyAAAAAElFTkSuQmCC",
        "image": null,
        "moyenne": null,
        "responsabilite": "",
        "annee_academique_active": "2024-2025",
        "frais_scolarite": {
            "2024-2025": [
                {
                    "id": 4,
                    "etudiant": 3,
                    "annee_academique": 1,
                    "annee_academique_nom": "2024-2025",
                    "designation": 4,
                    "designation_nom": "Inscription",
                    "montant_paye": "86117.00",
                    "methode_paiement": "BOA",
                    "reference": "BXF0V-Ref",
                    "date_de_paiement": "2025-04-18T09:50:57.507351Z"
                },
                {
                    "id": 5,
                    "etudiant": 3,
                    "annee_academique": 1,
                    "annee_academique_nom": "2024-2025",
                    "designation": 1,
                    "designation_nom": "Tranche 1",
                    "montant_paye": "59692.00",
                    "methode_paiement": "BOA",
                    "reference": "TRV-MA-Ref",
                    "date_de_paiement": "2025-04-18T10:04:21.599786Z"
                }
            ]
        }
    }

Le designation venant de l'url (http://localhost:8000/api/tarifs/)
Les données reçues ressemmblent à ceci:
{
    "designation": "Inscription",
    "montant": "86117.00",
    "niveau": 1
}

Ce niveau venant de l'url (http://localhost:8000/api/niveau/)
Les données reçues sont: 
    {
        "id": 1,
        "nom": "L1"
    },
    {
        "id": 2,
        "nom": "L2"
    },
    {
        "id": 3,
        "nom": "L3"
    },
    {
        "id": 4,
        "nom": "M1"
    },
    {
        "id": 5,
        "nom": "M2"
    }

    Alors essayer d'adapter votre reponse pour cela 
    Essayer de modifier en vrai modal au lieu de sweetalert2 le modal de création, de mise à jour 
    Essayer d'afficher 10 resutats par page pour une meilleure vue et experience utilisateur, 
    Ajouter un chargement dynamique lors de la recuperation des frais scolarite
