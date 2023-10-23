const goals = [
  {
    hours: 16,
    stops: 5,
    checklist: [
      {
        text: 'A spot north of 42 degrees',
        condition: point => point.latlong[0] > 42
      },
      {
        text: 'A city over 500,000 in population',
        condition: point => point.population > 500000
      },
      {
        text: 'A state capital',
        condition: point => point.capital 
      },
      {
        text: 'A spot on the Ohio River',
        condition: point => point.rivers.includes('Ohio') 
      },
      {
        text: 'A spot on a Great Lake',
        condition: point => point.lakes.includes('Huron') || point.lakes.includes('Superior') 
      }
    ]
  }
];

/* <li>A state capital</li> capital: boolean
<li>See the ocean</li> 
<li>A national park</li> 
<li>A city in Arkansas</li>
<li>A city above 4000 feet in elevation</li> 
<li>A city under 60,000 in population</li>
<li>A city over 1,000,000 in population</li>
<li>A city with a pro basketball, baseball, and football team</li>
<li>Two cities in the same state</li>
<li>10 different states</li>
<li>A city on a Great Lake</li>
<li>A city on the Missisippi River</li>
<li>A city on the Missouri River</li>
<li>A city on the Ohio River</li>
<li>A city on the Tennesee River</li>
<li>A city on the Colorado River</li>
<li>A city north of the 45th parallel longitude line</li>
<li>A state that borders Canada or Mexico</li> 
<li>A spot in the desert</li> */

export { goals as default };