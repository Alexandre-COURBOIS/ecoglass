import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import * as mapboxgl from 'mapbox-gl';
// @ts-ignore
import * as MapBoxDirection from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import {ContainersService} from "../../Services/containers.service";
import * as turf from '@turf/turf';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // @ts-ignore
  private map: mapboxgl.Map;
  private direction: MapBoxDirection;

  constructor(private containerService: ContainersService) {
  }

  ngOnInit(): void {
    this.containerService.getContainer().subscribe(value => {
      // @ts-ignore
      mapboxgl.accessToken = environment.mapBoxKey;

      this.direction = new MapBoxDirection({
        accessToken: environment.mapBoxKey,
        unit: 'metric',
        profile: 'mapbox/cycling',
        controls: {
          inputs: true,
          instructions: false,
        },
        language: 'fr'
      });

      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 5,
        center: [2.209667, 46.232193]
      });
      this.map.addControl(this.direction);
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
            street: value[i].street,
            // @ts-ignore
            postalCodeAndCity: value[i].postalCode + ' ' + value[i].city
          }
        })
      }
      //console.log(geojson);

       this.direction = new MapBoxDirection({
        accessToken: environment.mapBoxKey,
        unit: 'metric',
        profile: 'mapbox/cycling',
        language: 'fr',
        interactive: false
      });

      this.map.on('load', () => {

        this.map.loadImage(
          'assets/image/recycling-bin.png',
          (error, image) => {
            if (error) throw error;
            // @ts-ignore
            this.map.addImage('recycling-bin', image);

            this.map.addControl(
              new mapboxgl.GeolocateControl({
                positionOptions: {
                  enableHighAccuracy: true
                },
                trackUserLocation: true
              })
            );

            this.map.addSource('containers', {
              type: 'geojson',
              // @ts-ignore
              data: geojson,
              cluster: true,
              clusterMaxZoom: 12,
              clusterRadius: 50
            });

            this.map.addLayer({
              id: 'clusters',
              type: 'circle',
              source: 'containers',
              filter: ['has', 'point_count'],
              paint: {
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
              source: 'containers',
              filter: ['has', 'point_count'],
              layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
              }
            });

            this.map.addLayer({
              id: 'unclustered-point',
              type: 'symbol',
              source: 'containers',
              filter: ['!', ['has', 'point_count']],

              layout: {
                'icon-image': 'recycling-bin',
                'icon-size': 1,
              },
              paint: {}
            });

            this.map.on('click', 'clusters', (e) => {
              var features = this.map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
              });
              // @ts-ignore
              var clusterId = features[0].properties.cluster_id;
              // @ts-ignore
              this.map.getSource('containers').getClusterExpansionZoom(
                clusterId,
                (err: any, zoom: any) => {
                  if (err) return;

                  this.map.easeTo({
                    // @ts-ignore
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                  });
                }
              );
            });

            this.map.on('click', 'unclustered-point', (e) => {
              const getThisDirection = () => {
                return this.direction;
              }
              // @ts-ignore
              var coordinates = e.features[0].geometry.coordinates.slice();
              // @ts-ignore
              var postalCodeAndCity = e.features[0].properties.postalCodeAndCity;
              // @ts-ignore
              var street = e.features[0].properties.street;


              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              const getUserLoc = () => new Promise((resolve,reject)=> {
                navigator.geolocation.getCurrentPosition(
                  position => {
                    resolve(position);
                  },
                  error => {
                    console.log(error.message);
                    reject(error);
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 1000
                  }
                );
              });

              var popup = new mapboxgl.Popup();

              popup.on('open', function(){
                getUserLoc().then(position => {
                  // @ts-ignore
                  let userLng = position.coords.longitude;
                  // @ts-ignore
                  let userLat = position.coords.latitude;

                  var distance = turf.distance([coordinates[0], coordinates[1]], [userLng, userLat], {units: "kilometers"});

                  popup.setLngLat(coordinates)
                    .setHTML(
                      // @ts-ignore
                      '<p>' + 'à ' + distance.toFixed([2]) + ' km de chez vous</p>' +
                      '<p>' + street + '<br>' + postalCodeAndCity + '</p>' + '<button class="btn btn-primary" id="btn">M\'y emmener</button>'
                    )

                  // @ts-ignore
                  document.getElementById("btn").addEventListener("click", function(){
                    var directions = getThisDirection();
                    navigator.geolocation.getCurrentPosition(position => {
                      directions.setOrigin(position.coords.longitude + ',' + position.coords.latitude)
                    });
                    directions.setDestination(coordinates)
                  });

                });
              });

              popup.addTo(this.map);
            });

            this.map.on('mouseenter', 'clusters', () => {
              this.map.getCanvas().style.cursor = 'pointer';
            });
            this.map.on('mouseleave', 'clusters', () => {
              this.map.getCanvas().style.cursor = '';
            });
          }
        )
      })


    }, error => {
      console.log(error);
    })
  };


}
