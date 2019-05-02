# A-Fried-Park-Macdonald

[Link to Github Repo](https://github.ccs.neu.edu/DS4200-S19/A--Fried-Park-Macdonald.git)
[Link to Github Pages](https://pages.github.ccs.neu.edu/DS4200-S19/A--Fried-Park-Macdonald/)

#### Motivation

The intersection of Massachusetts Avenue and Washington Street in Boston’s South End falls in the middle of the Chester Square neighborhood. At the corner of the intersection lies the Alexandra Hotel, a once lavish hotel, the neighborhood landmark has become dilapidated. The hotel was recently bought by a developer that filed plans with the city to remake the hotel. Already a busy intersection, with limited parking in the area for a new 150-room hotel, the residents of the Chester Square had obvious concerns about the affect the hotel could have on the traffic in the area.

Initially, our goal was to create a visualization that effectively showed how the introduction of a hotel could adversely affect the traffic flow in the adjacent intersection. However, after reviewing the dataset provided, we came to the conclusion that the hotel would minimally affect the nearby intersection. As such, our current goal is to create a user-friendly visualization that effectively distills the traffic data from the dataset and can convince the neighborhood association that their worries may be unfounded.

#### Data

The data we obtained shows the number of vehicles (of different types) that went through the Mass. Ave. and Wash. St. intersection in fifteen minute intervals throughout the day. In the developer’s proposal submitted to the city, there were many other datasets such as wind tests, or shadow projections that we deemed irrelevant for the purposes of our project. One dataset that we considered using, and still may is one that shows the average delay of a vehicle going through the intersection, currently, as well as projections for 2025 without a rebuilt Alexandra Hotel, and projections for 2025 with a rebuilt Alexandra hotel. The traffic data in the report differs slightly from the data we received in csv files, so we do not know exactly where the data we are using is from yet, which is why we are hesitant to use the delay data until we know more. We also had locations of different types of parking in the surrounding area.

#### Goals

From the interview, we learned that the Chester Square Neighbors were worried that rebuilding the hotel increase congestion at an intersection that was already heavily congested and that parking would become even more limited. Initially, our goal was to create a visualization that effectively presented how the introduction of a hotel could adversely affect the traffic flow in the adjacent intersection and how modifying the features of the road could improve or worsen traffic conditions. However, the dataset we relied on for predictive analysis was inconsistent with the traffic volume dataset, and was likely from a biased source. As such, we could not accurately predict how the hotel will affect traffic. Instead, we decided to focus primarily on creating a user-friendly visualization that effectively shows the current traffic data from the dataset so that the neighborhood can make decisions about how to pursue the developer of the hotel to help with traffic changes in the intersection.

Our original and modified task analysis is as shown below.
**Rank**|**Domain Task**|**Query Task**|**Search Task**|**Analyze Task**
-----|-----|-----|-----|-----
**Original Task Analysis**| | | | 
1|Explore potential road reconstruction options and its traffic flow|Compute Derived Value|Explore|Discover
2|Explore potential sidewalk reconstruction and bus stop renovation and its traffic flow|Compute Derived Value|Explore|Discover
**Modified Scope**| | | | 
1|Explore current traffic conditions and its traffic flow|Summarize|Browse|Discover

#### User Interface Walkthrough

On the navigation bar at the top of the visualization you will see "API". Press this to navigate to a page that explains the API  we have created in order to fetch data.
On the left side of the visualization itself you can see selector buttons that will toggle various aspects of the intersection and line chart. These include, showing/hiding the different vehicle types if, for example, you only want to look at cars, or showing different types of parking or bus stops around the intersection.

The intersection in the middle has arrows that show traffic flow. On the intersection, you can click an inbound arrow, that then shows just potential outbound routes from making a left turn, going straight through the intersection, or making a right turn. The arrows will adjust in color to reflect just flow relative to the arrows currently showing on the intersection. Clicking an inbound, or an inbound and outbound arrow pair on the intersection will show traffic volume for that specific route on the line chart on the right. Clicking again anywhere on the intersection will again show all arrows.

On the right side is a line chart that shows the aggregate volume of the traffic in the intersection. A secondary set of lines with different opacity will be shown depending on the arrows selected on the intersection.

A brusher on the line chart can be created and used to change the time frame that is shown in the intersection. Clicking anywhere on the line chart will create a starting time for the brush, which can be dragged to any length of time. Once a brush is created, clicking anywhere inside will select it so that it can be dragged, but remain the same size. Clicking on the edges will extend or shrink it. Clicking anywhere on the line graph outside the brusher will remove it.
