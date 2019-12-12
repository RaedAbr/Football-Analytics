# Football analytics

## Groupe

- Raed Abdennadher : raed.adbennadher@master.hes-so.ch
- Ludovic Gindre : ludovic.gindre@master.hes-so.ch
- Yoan Marti : yoan.marti@master.hes-so.ch

## Résumé du projet

### Public cible

Notre cible est tout les amateur de football cherchant a mieux comprendre l'impacte de certains joueurs sur le jeu.

### Objectif

Nos buts premiers étaient :

- Mettre en lumière l'importance de certains postes clés dans le football moderne
- Donner plus d'importance aux joueurs n'ayant pas un rôle sur le devant de la scène.

### Source des données

Les données proviennent du site [StatsBomb](https://statsbomb.com/). Ils supportent activement la recherche dans le domaine du football. C'est pourquoi, ils s'engagent à partager publiquement de nouvelles données de manière régulière.

Les données des matchs de football étant leur principale source de revenu, l'accès aux données gratuites est limité et elles ne sont pas complètes. Ils ne publient pas une saison entière mais seulement quelques matchs. Lorsqu'un match est publié chaque événement du match est également publié. On ne peut pas accéder aux données des matchs en direct. En effet, ces données ne sont pas publiées en live sur leur API. Elles sont publiées sur leur [GitHub](https://github.com/statsbomb/open-data) et sont régulièrement mises à jour avec de nouvelles données. 

### Technologies utilisées

<!-- TODO -->

---

## Introduction

Le football est le sport le plus populaire au monde. il peut grandement impacter tout un peuple tant il est populaire. Pourtant, ce sport si adoré du grand public et tant pratiqué tout autour du globe, recèle toujours bien des secrets. Nous avons tenté de mieux comprendre les aspects tactiques et techniques de ce sport et ainsi mettre en lumière les éléments qui rendent une équipe meilleure qu'une autre.

Le plus souvent, les statistiques présentées lors des matchs sont relativement peu explicites. Ces statistiques, comme la possession des deux équipes, le nombre de tirs par équipe ou le pourcentage de passes réussies, permettent d'identifier qu'une équipe dans sa globalité est meilleure que l'autre. En revanche, elles ne présentent que les résultat de faits sans en connaître les causes. 

Nous avons cherché à apporter une nouvelles façon de voir le football. Notre principale critique des statistiques actuelles est qu'on ne distingue pas l'importance d'un joueur ou d'une association de deux joueurs complémentaires dans une équipe. Pour mieux comprendre le football, il faut connaitre son fonctionnement et son organisation.

Le football mondial est divisé en plusieurs compétitions auxquelles participent diverses équipes. Chaque occurence de d'une compétition a ensuite lieu à interval régulier, le plus souvent chaque saison.

L'une des spécificités du football est que les saisons n'ont pas lieu en même temps partout sur le globe. En Europe, une saison commence entre la fin du mois d'août et le début du mois de septembre et se termine entre la fin du mois de mai et le début du mois de juin de l'année suivante. Une saison européenne chevauche donc deux années. Par exemple, la saison en cours en Europe se terminera en 2020. On parle donc de la saison 2019/2020. En revanche, Aux états-unis les saisons commencent en mars et se terminent en décembre. La saison venant de se terminer était la saison 2019.

Une compétition est divisée en journées. Une journée voit chaque équipe de la compétition affronter une autre équipe. Elle se termine donc lorsque chaque équipe a affronté une autre équipe. Une journée d'une compétition peut durer sur plusieurs jours. Deux matchs d'une même journée peuvent être à une date différente.

Pendant un match toute une série d'événements ont lieu. Ils peuvent être de nature diverse. Un joueur fait une passe ou un tir au but, un gardien arrête un tir. tous ces événements ont lieu dans des zones sur le terrain. Nous avons cherché à comprendre quelles étaient les zones d'influences des joueurs et quels sont les joueurs ayant le plus d'influence sur la victoire ou la défaite d'une équipe. lors de chaque match, le site StatsBomb recueille tout ces événements en annotant la position de l'événement sur le terrain, le joueur concerné par l'événement et l'heure de l'événement.

## Conception

### Données utilisées

#### Evénements des matchs de football par StatsBomb

Les événements peuvent être de nature très différentes. nous avons décidé des les représenter sur une carte représentant un terrain de football. Pour la représentation, nous avons choisi d'encoder la densité des points dans une zone par une couleur évoluant du bleu au rouge. Nous pouvons ainsi afficher une heatmap d'un ou plusieurs joueurs. 

![image-20191212172615302](/Users/ludo/Cours/Master/3eme Semestre/VI/Football-Analytics/img/heatmap.png)

​						*Heatmap de Xavi lors du match entre Barcelone et Valence (6 - 0 pour Barcelone)*

Les événements pouvant influer sur cette heatmap sont les suivants:

| Événement      | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| Ball Receipt   | La réception ou la réception prévue d’une passe.             |
| Ball Recovery  | Tentative de récupération d'une balle perdue                 |
| Dispossessed   | Le joueur perd le ballon contre un adversaire parce qu'il a été tacklé par un défenseur sans tenter de dribbler. |
| Duel           | Un duel est un affrontement entre deux joueurs de deux camps opposés dans le match. |
| Block          | Blocage de la balle en se tenant sur son chemin.             |
| Offside        | Violation du hors-jeu. Cas résultant d'un tir ou d'un dégagement. |
| Clearance      | Action d'un joueur défensif pour écarter le danger sans intention de passer le ballon à un coéquipier. |
| Interception   | Empêcher la passe d'un adversaire d'atteindre ses coéquipiers en se plaçant  sur la trajectoire du ballon ou en réagissant pour l'intercepter. |
| Dribble        | Tentative d'un joueur de battre un adversaire                |
| Shot           | Tentative de marquer un but avec n'importe quelle partie (légale) du corps. |
| Pressure       | Faire pression sur un joueur adverse qui reçoit, transporte ou lâche le ballon. |
| Foul Won       | Une faute gagnée est définie comme le fait pour un joueur de gagner un coup franc ou un penalty pour son équipe après avoir été victime d'une faute commise par un joueur adverse. |
| Foul Committed | Toute infraction sanctionnée par un acte de faute de la part d'un arbitre. Les hors-jeu ne sont pas considérés comme une faute commise. |
| Bad Behaviour  | Lorsqu'un joueur reçoit un carton en raison d'une infraction en dehors du jeu. |
| Shield         | Le joueur protège le ballon qui sort des limites pour empêcher l'adversaire de le garder en jeu. |
| Pass           | Le ballon est passé entre les coéquipiers.                   |
| Miscontrol     | Le joueur perd le ballon à cause d'un mauvais toucher.       |
| Dribbled Past  | Le joueur est dribblé par un adversaire.                     |
| Carry          | Un joueur contrôle le ballon à ses pieds tout en se déplaçant ou en restant immobile. |

Il est important de noter que les déplacements des joueurs ne sont pas des événements. Ils ne constituent donc pas les heatmaps. Les zones blanches (sans événement) des heatmaps ne sont donc pas une absence du joueur dans la zone mais une absence d'événement.

## Application des concepts vus en cours

### Data-inc ratio



### 8 mantras de Ben Shneiderman

### Lois de Gestalt

### Daltonisme

Le simulateur [Coblis](http://www.color-blindness.com/coblis-color-blindness-simulator/) (*Color Blindness Simulator*) permet de visualiser une image telle qu'elle serait vue par une personne souffrant de daltonisme.



## Améliorations



## Conclusion

