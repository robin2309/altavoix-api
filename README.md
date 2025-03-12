## Clean data

    rm -r scripts/data

    rm -r scripts/extracted

    rm -r output

   

## Execute scripts

    node main.js

## Open Data Gouv doc

Fichier *DLR5L17.\*.json* : **Dossier parlementaire** de la 17ème législature
download: https://data.assemblee-nationale.fr/travaux-parlementaires/dossiers-legislatifs

Fichier *VTANR5L17.\*.json* : **Scrutin** de la 17ème législature
download: https://data.assemblee-nationale.fr/travaux-parlementaires/votes

Dossier Parlementaire **[:Contient -> 1]** Scrutin
Document de Dossier **[:Attaché à -> 1]** Dossier Parlementaire

