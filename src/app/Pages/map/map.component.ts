import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import * as mapboxgl from 'mapbox-gl';
import {HttpClient} from "@angular/common/http";
import {ContainersService} from "../../Services/containers.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // @ts-ignore
  private map: mapboxgl.Map;

  constructor(private containerService: ContainersService) {
  }

  ngOnInit(): void {
    this.containerService.getContainer().subscribe(value => {
      // @ts-ignore
      mapboxgl.accessToken = environment.mapBoxKey;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 5,
        center: [2.209667, 46.232193]
      });
      var geojson = {
        type: 'FeatureCollection',
        features: [{}],
        properties: {}
      }
      for (let i = 0; i < Object.keys(value).length; i++) {
        geojson.features.push({
          geometry: {
            type: 'Point',
            // @ts-ignore
            coordinates: [value[i].longitude, value[i].latitude]
          },
          properties: {
            // @ts-ignore
            address: value[i].address,
            // @ts-ignore
            postalCodeAndCity: value[i].postalCode + value[i].city
          }
        })
      }
      console.log(geojson);

      this.map.on('load', () => {


        this.map.addSource('earthquakes', {
          type: 'geojson',
          // @ts-ignore
          data: geojson,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        this.map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * Blue, 20px circles when point count is less than 100
//   * Yellow, 30px circles when point count is between 100 and 750
//   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
            ]
          }
        });

        this.map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });

        this.map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'earthquakes',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });
      })


    }, error => {
      console.log(error);
    })
  };


}
