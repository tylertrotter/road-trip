<template>
  <div id="map" class="map-container">

    <svg id="map" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 887.1 638.4">

      <static-map />

      <g class="points">
        <g 
          v-for="point in points" 
          :key="point.name" 
          @click="handlePointClick(point.name)"
        >
          <circle 
            class="city"
            :class="[{'active': currentPoint.name === point.name}, 'city--' + (point.population > 500000 ? 'l' : point.population > 200000 ? 'm' : 's')]" 
            :cx="point.location[0]" 
            :cy="point.location[1]"
          />
          <circle
            class="touch"
            :cx="point.location[0]" 
            :cy="point.location[1]"
          />
          <text
            :x="point.location[0] - 3" 
            :y="point.location[1] + 1"
            text-anchor="end"
          >{{ point.name }}</text>
        </g>
      </g>

      <line 
        v-if="consideredPoint"
        :x1="currentPoint.location[0]" 
        :y1="currentPoint.location[1]" 
        :x2="consideredPoint.location[0]" 
        :y2="consideredPoint.location[1]" 
        stroke="pink" 
        stroke-width="2" 
        stroke-dasharray="2 6"
      />

      <g class="route">
        <line 
        v-for="leg in legs"
        :key="leg[0].name + ' - ' + leg[1].name"
        :x1="leg[0].location[0]" 
        :y1="leg[0].location[1]" 
        :x2="leg[1].location[0]" 
        :y2="leg[1].location[1]" 
        stroke="pink" 
        stroke-width="2"
      />
      </g>
    </svg>
  </div>

  <div class="info">
    <h3>Current Location: {{ currentPoint.name }}</h3> 
    <div v-if="consideredPoint">
      Proposed drive to: {{ consideredPoint.name }}
      <div v-if="!isPossible()">This is too far away.</div>
      <div v-else>Distance: {{ consideredDistance }} hours away.</div>
    </div> 

    <h3>Trip so Far</h3>
    <div>Total Hours: {{ totalHours }}</div>
    <div>Stops: {{ legs.length }}</div>
  </div>
  
  <div class="controls">
    <button @click="handleCancelPoint()">Cancel</button>
    <button @click="handleAcceptLeg()" :disabled="!isPossible()">Accept</button>
    <button v-if="legs.length" @click="clearRoute()">Clear Route</button>
  </div>

  <div class="goals">
    <div>
      <h3>Goals:</h3>
      <ul>
        <li>{{ goal.hours }} hours or less in the car</li>
        <li>{{  goal.stops }} stops or less</li>
      </ul>
    </div>

    <div>
      <h4>Stops on the Way - Checklist:</h4>
      <ul>
        <li v-for="(listItem, i) in goal.checklist" :key="i" :class="{'done': listItem.done}">{{ listItem.text }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Panzoom from '@panzoom/panzoom'

import StaticMap from './StaticMap.vue';

// data
import points from '/src/data/points';
import distances from '/src/data/distances';
import goals from '/src/data/goals';

export default {
  name: 'rt-usa',
  components: { StaticMap },
  data() {
    return {
      points: points,
      startingPoint: null,
      currentPoint: null,
      consideredPoint: null,
      consideredDistance: null,
      legs: [],
      possibleDrives: null,
      totalHours: 0,
      goal: goals[0]
    }
  },
  created() {
    this.init();
  },
  mounted() {
    // document.querySelector('#points').addEventListener('click', this.handlePointClick);

    const mapContainer = document.getElementById('map')
    const panzoom = Panzoom(mapContainer, {
      maxScale: 8,
			minScale: 1,
      step: 1.5,
      panOnlyWhenZoomed: true,
      contain: 'outside',
      cursor: 'default'
    });
    panzoom.pan(0, 0);
    panzoom.zoom(1.2, { animate: false });
    mapContainer.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)

    mapContainer.addEventListener('panzoomchange', (event) => {
      let eventType = event.detail?.originalEvent?.type;

      if (eventType === 'wheel')
        panzoom.setOptions({ step: .25 });
      else
        panzoom.setOptions({ step: 1.5 });
    });
  },
  methods: {
    init() {
      this.startingPoint = points[0];
      this.currentPoint = this.startingPoint;
      this.getPossibleDrives();
    },
    handlePointClick(pointName) {
      this.consideredPoint = this.getPointByName(pointName);

      if (this.isPossible())
        this.consideredDistance = this.possibleDrives.find(drive => drive.points.includes(this.consideredPoint.id)).distance;
    },
    getPointByName(pointName) {
      return this.points.find(point => point.name === pointName);
    },
    handleAcceptLeg() {
      this.legs.push([this.currentPoint, this.consideredPoint]);
      this.currentPoint = this.consideredPoint;
      this.consideredPoint = null;
      this.totalHours = this.totalHours + this.consideredDistance;
      this.checkOffStuff();
      this.getPossibleDrives();
    },
    handleCancelPoint() {
      this.consideredPoint = null;
    },
    getPossibleDrives() {
      this.possibleDrives = distances.filter(drive => drive.points.includes(this.currentPoint.id));
    },
    isPossible() {
      return this.consideredPoint && typeof this.possibleDrives.find(drive => drive.points.includes(this.consideredPoint.id)) !== 'undefined';
    },
    clearRoute() {
      this.legs = [];
      this.init();
    },
    checkOffStuff() {
      this.goal.checklist.forEach(item => {
        if (item.condition(this.currentPoint)) {
          item.done = true;
        }
      }) 
    }
  }
}
</script>

<style>
.city {
  fill: black;
  stroke: white;
}
.city--l {
  r: 3;
}
.city--m {
  r: 2;
  stroke-width: .75;
}

.city--s {
  r: 1;
  stroke-width: .5;
}

.city:hover {
  stroke: yellow;
  stroke-width: 1;
}

.city.active {
  stroke: red;
  stroke-width: 1;
}

.touch {
  r: 7;
  opacity: 0;
}

svg {
  width: 100%;
  height: 100%;
  /* height: vh; */
}
/* path {
  fill: rgb(200, 200, 200);
  stroke: white;
  stroke-width: .5;
} */

line {
  stroke-linecap: round;
}
.done {
  text-decoration: line-through;
}

.map-container {
  width: 100%;
  height: 100vh;
  margin: 0 auto;

}

.info,
.goals,
.controls {
  position: fixed;
  z-index: 1;
  bottom: 0;
  background: rgb(214, 214, 214);
  padding: 20px;
}

.info {
  left: 0;
}

.goals {
  left: 320px;
}

.controls {
  right: 0;
}



svg text {
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 2.5px;
        fill: black;
        opacity: 0;
        transition: opacity .2s;
      }

      [id^='touch'] {
        opacity: 0;
      }

      [id^='dot'] {
        fill: black;
      }

      [style*="scale(5"].map-container text,
      [style*="scale(6"].map-container text,
      [style*="scale(7"].map-container text,
      [style*="scale(8"].map-container text {
        opacity: 1;
      }
</style>
