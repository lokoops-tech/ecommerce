export const DELIVERY_LOCATIONS = {
    Baringo: {
        baseDeliveryTime: "2-3 days",
        zones: ["Urban", "Rural", "Remote"],
        stages: [
          {
            name: "Kabarnet Town",
            fee: 800,
            peakFee: 1000,
            bulkDiscount: 150,
            estimatedTime: "2 days",
            instructions: "4x4 vehicle required during rainy season",
            landmarks: ["Kabarnet Museum", "County Offices"],
            pickupPoints: ["Kabarnet Bus Stage", "Total Station"]
          },
          {
            name: "Eldama Ravine",
            fee: 850,
            peakFee: 1050,
            bulkDiscount: 150,
            estimatedTime: "2-3 days",
            landmarks: ["Eldama Ravine Town Hall", "Police Station"],
            pickupPoints: ["Main Bus Stage"]
          },
          {
            name: "Marigat",
            fee: 850,
            peakFee: 1050,
            bulkDiscount: 150,
            estimatedTime: "2-3 days",
            landmarks: ["Eldama Ravine Town Hall", "Police Station"],
            pickupPoints: ["Maigat Town"]
          }
        ]
      },
  
    Bomet: {
      baseDeliveryTime: "1-2 days",
      zones: ["Township", "Rural Areas"],
      stages: [
        {
          name: "Bomet Town",
          fee: 700,
          peakFee: 850,
          bulkDiscount: 100,
          estimatedTime: "1 day",
          instructions: "Early morning deliveries preferred",
          landmarks: ["Bomet Green Stadium", "County Assembly"],
          pickupPoints: ["Bomet Bus Park", "Tuskys Supermarket"]
        },
        {
        name: "Sotik",
        fee: 700,
        peakFee: 850,
        bulkDiscount: 100,
        estimatedTime: "1 day",
        instructions: "Early morning deliveries preferred",
        landmarks: ["Bomet Green Stadium", "County Assembly"],
        pickupPoints: ["sotik"]
      }

      ]
    },
  
    Bungoma: {
      baseDeliveryTime: "1-2 days",
      zones: ["Urban", "Peri-urban", "Rural"],
      stages: [
        {
          name: "Bungoma Town",
          fee: 600,
          peakFee: 750,
          bulkDiscount: 100,
          estimatedTime: "1 day",
          instructions: "Available 7am-7pm",
          landmarks: ["Bungoma State Lodge", "Kanduyi Stadium"],
          pickupPoints: ["Bungoma Bus Park", "Khetias Supermarket"]
        },
        {
          name: "Kimilili",
          fee: 600,
          peakFee: 750,
          bulkDiscount: 100,
          estimatedTime: "1 day",
          instructions: "Available 7am-7pm",
          landmarks: ["Bungoma State Lodge", "Kanduyi Stadium"],
          pickupPoints: [ "Kimilili"]
        },
      ]
    },

  Busia: {
    baseDeliveryTime: "1-2 days",
    zones: ["Border Town", "Interior"],
    stages: [

      {
        name: "Busia Town",
        fee: 700,
        peakFee: 850,
        bulkDiscount: 120,
        estimatedTime: "1 day",
        instructions: "Cross-border delivery available",
        landmarks: ["Busia Border", "Sofia Market"],
        pickupPoints: ["Border Point", "KCB Plaza"],
      
         },
     ]
    },
  "Elgeyo Marakwet" : {
    baseDeliveryTime: "2-3 days",
    zones: ["Highland", "Valley"],
    stages: [
      {
        name: "Iten Town",
        fee: 200,
        peakFee: 950,
        bulkDiscount: 150,
        estimatedTime: "2 days",
        instructions: "Altitude considerations for sensitive items",
        landmarks: ["Kamariny Stadium", "County Offices"],
        pickupPoints: ["Iten Market", "View Point"]
      },
    ]
},
  

  Embu: {
    baseDeliveryTime: "1-2 days",
    zones: ["Urban", "Rural", "Agricultural"],
    stages: [
      {
        name: "Embu Town",
        fee: 600,
        peakFee: 750,
        bulkDiscount: 100,
        estimatedTime: "1 day",
        instructions: "Fresh produce handling available",
        landmarks: ["Embu Stadium", "University"],
        pickupPoints: ["Embu Market", "Metro Station"]
      }
    ]
  },
  
    Garissa: {
      baseDeliveryTime: "2-3 days",
      zones: ["Urban", "Semi-Arid", "Rural"],
      stages: [
        {
          name: "Garissa Town",
          fee: 1200,
          peakFee: 1500,
          bulkDiscount: 200,
          estimatedTime: "2 days",
          instructions: "Early morning deliveries for temperature control",
          landmarks: ["Garissa University", "County Assembly"],
          pickupPoints: ["Garissa Bus Park", "Town Center"]
        }
      ]
    },
  
    "Homa Bay": {
      baseDeliveryTime: "1-2 days",
      zones: ["Lakeside", "Mainland"],
      stages: [
        {
          name: "Homa Bay Town",
          fee: 800,
          peakFee: 950,
          bulkDiscount: 150,
          estimatedTime: "1 day",
          instructions: "Lake transport available for island deliveries",
          landmarks: ["Homa Bay Pier", "County Hospital"],
          pickupPoints: ["Main Stage", "Sofia Market"]
        }
      ]
    },
  
    Isiolo: {
      baseDeliveryTime: "2-3 days",
      zones: ["Town", "Rural", "Conservation"],
      stages: [
        {
          name: "Isiolo Town",
          fee: 900,
          peakFee: 1100,
          bulkDiscount: 150,
          estimatedTime: "2 days",
          instructions: "4x4 vehicle access for remote areas",
          landmarks: ["Buffalo Springs", "Military Base"],
          pickupPoints: ["Isiolo Bus Terminal", "Central Market"]
        }
      ]
    },
        Kajiado: {
          baseDeliveryTime: "1-2 days",
          zones: ["Urban", "Pastoral", "Wildlife"],
          stages: [
            {
              name: "Kajiado Town",
              fee: 700,
              peakFee: 850,
              bulkDiscount: 120,
              estimatedTime: "1 day",
              instructions: "Wildlife corridor considerations",
              landmarks: ["Kajiado County Offices", "Railway Station"],
              pickupPoints: ["Kajiado Market", "Shell Station"]
            },
            {
              name: "Kitengela",
              fee: 500,
              peakFee: 650,
              bulkDiscount: 100,
              estimatedTime: "Same day",
              landmarks: ["Kitengela Glass", "EPZ"],
              pickupPoints: ["Kitengela Mall", "Bus Station"]
            }
          ]
        },
      
        Kakamega: {
          baseDeliveryTime: "1-2 days",
          zones: ["Urban", "Forest", "Rural"],
          stages: [
            {
              name: "Kakamega Town",
              fee: 800,
              peakFee: 950,
              bulkDiscount: 150,
              estimatedTime: "1 day",
              instructions: "Rainforest route considerations",
              landmarks: ["Kakamega Forest", "Golf Hotel"],
              pickupPoints: ["Bus Park", "Muliro Gardens"]
            }
          ]
        },
      
        Kericho: {
          baseDeliveryTime: "1-2 days",
          zones: ["Tea Estates", "Urban", "Rural"],
          stages: [
            {
              name: "Kericho Town",
              fee: 750,
              peakFee: 900,
              bulkDiscount: 130,
              estimatedTime: "1 day",
              instructions: "Tea estate access protocols",
              landmarks: ["Tea Hotel", "Green Stadium"],
              pickupPoints: ["Main Bus Stage", "Tea Plaza"]
            }
          ]
        },
          
            Kiambu: {
              baseDeliveryTime: "Same day - 1 day",
              zones: ["Urban", "Peri-urban", "Agricultural"],
              stages: [
                {
                  name: "Thika",
                  fee: 400,
                  peakFee: 500,
                  bulkDiscount: 100,
                  estimatedTime: "2-3 hours",
                  instructions: "Industrial area access available 24/7",
                  landmarks: ["Thika Road Mall", "Blue Post Hotel"],
                  pickupPoints: ["Thika Bus Station", "Makongeni"]
                },
                {
                  name: "Ruiru",
                  fee: 350,
                  peakFee: 450,
                  bulkDiscount: 80,
                  estimatedTime: "1-2 hours",
                  landmarks: ["Ruiru Stadium", "KIST"],
                  pickupPoints: ["Ruiru Station", "Kimbo"]
                }
              ]
            },
          
            Kilifi: {
              baseDeliveryTime: "1-2 days",
              zones: ["Coastal", "Inland", "Tourist"],
              stages: [
                {
                  name: "Malindi",
                  fee: 900,
                  peakFee: 1100,
                  bulkDiscount: 150,
                  estimatedTime: "1 day",
                  instructions: "Beach hotel deliveries available",
                  landmarks: ["Vasco da Gama Pillar", "Marine Park"],
                  pickupPoints: ["Malindi Airport", "Central Market"]
                }
              ]
            },
          
            Kirinyaga: {
              baseDeliveryTime: "1-2 days",
              zones: ["Urban", "Rice Growing", "Mountain"],
              stages: [
                {
                  name: "Kerugoya",
                  fee: 600,
                  peakFee: 750,
                  bulkDiscount: 100,
                  estimatedTime: "1 day",
                  instructions: "Rice farm access routes available",
                  landmarks: ["County HQ", "General Hospital"],
                  pickupPoints: ["Main Bus Park", "Market"]
                }
              ]
            },
              
                Kisii: {
                  baseDeliveryTime: "1-2 days",
                  zones: ["Urban", "Highland", "Tea Zones"],
                  stages: [
                    {
                      name: "Kisii Town",
                      fee: 700,
                      peakFee: 850,
                      bulkDiscount: 120,
                      estimatedTime: "1 day",
                      instructions: "Soapstone handling available",
                      landmarks: ["Gusii Stadium", "Kisii University"],
                      pickupPoints: ["Main Stage", "Daraja Mbili"]
                    }
                  ]
                },
              
                Kisumu: {
                  baseDeliveryTime: "Same day - 1 day",
                  zones: ["Lakeside", "CBD", "Industrial"],
                  stages: [
                    {
                      name: "CBD",
                      fee: 400,
                      peakFee: 500,
                      bulkDiscount: 100,
                      estimatedTime: "2-3 hours",
                      instructions: "Lake freight services available",
                      landmarks: ["Kisumu Port", "United Mall"],
                      pickupPoints: ["Bus Park", "Jubilee Market"]
                    },
                    {
                      name: "Kondele",
                      fee: 450,
                      peakFee: 550,
                      bulkDiscount: 80,
                      landmarks: ["Kondele Market", "Police Station"],
                      pickupPoints: ["Stage Market", "Total Station"]
                    }
                  ]
                },
              
                Kitui: {
                  baseDeliveryTime: "1-2 days",
                  zones: ["Urban", "Semi-Arid", "Rural"],
                  stages: [
                    {
                      name: "Kitui Town",
                      fee: 800,
                      peakFee: 950,
                      bulkDiscount: 150,
                      estimatedTime: "1 day",
                      instructions: "Early morning deliveries recommended",
                      landmarks: ["Kitui Stadium", "KEFRI Center"],
                      pickupPoints: ["Main Stage", "Kalundu Market"]
                    }
                  ]
                },
           
                    Kwale: {
                      baseDeliveryTime: "1-2 days",
                      zones: ["Coastal", "Inland", "Tourist"],
                      stages: [
                        {
                          name: "Diani",
                          fee: 800,
                          peakFee: 1000,
                          bulkDiscount: 150,
                          estimatedTime: "1 day",
                          instructions: "Beach resort access available",
                          landmarks: ["Diani Beach", "Shopping Center"],
                          pickupPoints: ["Ukunda Airstrip", "Beach Road"]
                        }
                      ]
                    },
                  
                    Laikipia: {
                      baseDeliveryTime: "1-2 days",
                      zones: ["Ranch", "Conservation", "Urban"],
                      stages: [
                        {
                          name: "Nanyuki",
                          fee: 700,
                          peakFee: 850,
                          bulkDiscount: 120,
                          estimatedTime: "1 day",
                          instructions: "Ranch access permits required",
                          landmarks: ["Mt. Kenya Safari Club", "Equator Point"],
                          pickupPoints: ["Nanyuki Mall", "Military Base"]
                        }
                      ]
                    },
                  
                    Lamu: {
                      baseDeliveryTime: "2-3 days",
                      zones: ["Island", "Mainland", "Heritage"],
                      stages: [
                        {
                          name: "Lamu Town",
                          fee: 1200,
                          peakFee: 1500,
                          bulkDiscount: 200,
                          estimatedTime: "2 days",
                          instructions: "Boat transfer included",
                          landmarks: ["Lamu Fort", "Seafront"],
                          pickupPoints: ["Jetty", "Market Square"],
                          specialServices: {
                            boatTransfer: true,
                            donkeyTransport: "Available",
                            heritage: "Special handling"
                          }
                        }
                      ]
                    },

             
                        Machakos: {
                          baseDeliveryTime: "1 day",
                          zones: ["Urban", "Industrial", "Rural"],
                          stages: [
                            {
                              name: "Machakos Town",
                              fee: 500,
                              peakFee: 650,
                              bulkDiscount: 100,
                              estimatedTime: "3-4 hours",
                              instructions: "24/7 delivery available",
                              landmarks: ["People's Park", "Machakos University"],
                              pickupPoints: ["Bus Station", "Mulolongo"]
                            },
                            {
                              name: "Athi River",
                              fee: 400,
                              peakFee: 500,
                              bulkDiscount: 80,
                              estimatedTime: "2-3 hours",
                              landmarks: ["EPZ", "Portland"],
                              pickupPoints: ["KMC", "Shalom Hospital"]
                            }
                          ]
                        },
                      
                        Makueni: {
                          baseDeliveryTime: "1-2 days",
                          zones: ["Semi-Arid", "Urban", "Agricultural"],
                          stages: [
                            {
                              name: "Wote",
                              fee: 700,
                              peakFee: 850,
                              bulkDiscount: 120,
                              estimatedTime: "1 day",
                              instructions: "Early morning deliveries preferred",
                              landmarks: ["County Offices", "Unoa Grounds"],
                              pickupPoints: ["Main Stage", "Market"]
                            }
                          ]
                        },
                      
                        Mandera: {
                          baseDeliveryTime: "3-4 days",
                          zones: ["Border", "Urban", "Rural"],
                          stages: [
                            {
                              name: "Mandera Town",
                              fee: 2000,
                              peakFee: 2500,
                              bulkDiscount: 300,
                              estimatedTime: "3 days",
                              instructions: "Security clearance required",
                              landmarks: ["Border Point", "County HQ"],
                              pickupPoints: ["Main Bus Park", "Airport"],
                              specialRequirements: {
                                security: "Escort available",
                                documentation: "Required",
                                timing: "Daylight hours only"
                              }
                            }
                          ]
                        },
                       
                            Marsabit: {
                              baseDeliveryTime: "2-3 days",
                              zones: ["Desert", "Mountain", "Urban"],
                              stages: [
                                {
                                  name: "Marsabit Town",
                                  fee: 1800,
                                  peakFee: 2200,
                                  bulkDiscount: 300,
                                  estimatedTime: "2 days",
                                  instructions: "Desert-ready vehicles only",
                                  landmarks: ["Marsabit National Park", "Central Square"],
                                  pickupPoints: ["Main Stage", "Airport"],
                                  specialServices: {
                                    desertCrossing: true,
                                    waterSupply: "Included",
                                    satelliteTracking: "Active"
                                  }
                                }
                              ]
                            },
                          
                            Meru: {
                              baseDeliveryTime: "1-2 days",
                              zones: ["Highland", "Urban", "Agricultural"],
                              stages: [
                                {
                                  name: "Meru Town",
                                  fee: 700,
                                  peakFee: 850,
                                  bulkDiscount: 120,
                                  estimatedTime: "1 day",
                                  instructions: "Miraa handling available",
                                  landmarks: ["Meru National Park", "County HQ"],
                                  pickupPoints: ["Gakoromone Market", "Makutano"]
                                }
                              ]
                            },
                          
                            Migori: {
                              baseDeliveryTime: "1-2 days",
                              zones: ["Border", "Mining", "Urban"],
                              stages: [
                                {
                                  name: "Migori Town",
                                  fee: 900,
                                  peakFee: 1100,
                                  bulkDiscount: 150,
                                  estimatedTime: "1 day",
                                  instructions: "Cross-border services available",
                                  landmarks: ["Migori Stadium", "Gold Mines"],
                                  pickupPoints: ["Bus Park", "Sony Sugar"],
                                  specialServices: {
                                    borderClearance: true,
                                    miningZoneAccess: "Permitted",
                                    customsHandling: "Available"
                                  }
                                }
                              ]
                            },
                                Mombasa: {
                                  baseDeliveryTime: "Same day - 1 day",
                                  zones: ["Island", "Mainland North", "Mainland South"],
                                  stages: [
                                    {
                                      name: "CBD",
                                      fee: 400,
                                      peakFee: 500,
                                      bulkDiscount: 100,
                                      estimatedTime: "2-3 hours",
                                      instructions: "Ferry crossing coordinated",
                                      landmarks: ["Fort Jesus", "Treasury Square"],
                                      pickupPoints: ["Mwembe Tayari", "Likoni Ferry"],
                                      specialServices: {
                                        ferryPriority: true,
                                        portAccess: "Available",
                                        touristZones: "Covered"
                                      }
                                    },
                                    {
                                      name: "Nyali",
                                      fee: 500,
                                      peakFee: 600,
                                      bulkDiscount: 120,
                                      estimatedTime: "3-4 hours",
                                      landmarks: ["City Mall", "Beach Hotels"],
                                      pickupPoints: ["Nyali Centre", "Kongowea"]
                                    }
                                  ]
                                },
                              
                                Muranga: {
                                  baseDeliveryTime: "1-2 days",
                                  zones: ["Highland", "Tea Zone", "Urban"],
                                  stages: [
                                    {
                                      name: "Murang'a Town",
                                      fee: 600,
                                      peakFee: 750,
                                      bulkDiscount: 100,
                                      estimatedTime: "1 day",
                                      instructions: "Tea factory access available",
                                      landmarks: ["Ihura Stadium", "County Offices"],
                                      pickupPoints: ["Main Stage", "Mukuyu Market"]
                                    }
                                  ]
                                },
                              
                                Narok: {
                                  baseDeliveryTime: "1-2 days",
                                  zones: ["Game Reserve", "Urban", "Rural"],
                                  stages: [
                                    {
                                      name: "Narok Town",
                                      fee: 800,
                                      peakFee: 1000,
                                      bulkDiscount: 150,
                                      estimatedTime: "1 day",
                                      instructions: "Mara route deliveries available",
                                      landmarks: ["Maasai Mara Gate", "William Ole Ntimama Stadium"],
                                      pickupPoints: ["Main Stage", "Cedar Mall"],
                                      specialServices: {
                                        gameReserveAccess: true,
                                        maasaiMarketDelivery: "Available",
                                        tourismSupport: "24/7"
                                      }
                                    }
                                  ]
                                },
                                    Nyamira: {
                                      baseDeliveryTime: "1-2 days",
                                      zones: ["Highland", "Tea Zone", "Urban"],
                                      stages: [
                                        {
                                          name: "Nyamira Town",
                                          fee: 700,
                                          peakFee: 850,
                                          bulkDiscount: 120,
                                          estimatedTime: "1 day",
                                          instructions: "Tea factory route access",
                                          landmarks: ["Nyamira Stadium", "County Offices"],
                                          pickupPoints: ["Main Stage", "Ekerenyo"],
                                          specialServices: {
                                            teaZoneDelivery: true,
                                            highlandVehicles: "Available",
                                            weatherAlerts: "Active"
                                          }
                                        }
                                      ]
                                    },
                                  
                                    Nyandarua: {
                                      baseDeliveryTime: "1-2 days",
                                      zones: ["Agricultural", "Urban", "Forest"],
                                      stages: [
                                        {
                                          name: "Ol Kalou",
                                          fee: 600,
                                          peakFee: 750,
                                          bulkDiscount: 100,
                                          estimatedTime: "1 day",
                                          instructions: "Farm access available",
                                          landmarks: ["County HQ", "Ol Kalou Stadium"],
                                          pickupPoints: ["Main Bus Park", "Market"],
                                          specialServices: {
                                            farmDelivery: true,
                                            coldStorage: "Available",
                                            bulkAgriProducts: "Handled"
                                          }
                                        }
                                      ]
                                    },
                                  
                                    Samburu: {
                                      baseDeliveryTime: "2-3 days",
                                      zones: ["Conservation", "Urban", "Remote"],
                                      stages: [
                                        {
                                          name: "Maralal",
                                          fee: 1500,
                                          peakFee: 1800,
                                          bulkDiscount: 250,
                                          estimatedTime: "2 days",
                                          instructions: "4x4 vehicle access only",
                                          landmarks: ["Maralal Stadium", "Camel Derby Ground"],
                                          pickupPoints: ["Main Stage", "Cultural Center"],
                                          specialServices: {
                                            conservancyAccess: true,
                                            culturalEvents: "Supported",
                                            remoteTracking: "Active"
                                          }
                                        }
                                      ]
                                    },
                                
                                        Siaya: {
                                          baseDeliveryTime: "1-2 days",
                                          zones: ["Lakeside", "Urban", "Rural"],
                                          stages: [
                                            {
                                              name: "Siaya Town",
                                              fee: 700,
                                              peakFee: 850,
                                              bulkDiscount: 120,
                                              estimatedTime: "1 day",
                                              instructions: "Lake region access",
                                              landmarks: ["Siaya Stadium", "Got Ramogi"],
                                              pickupPoints: ["Main Stage", "Siaya Mall"],
                                              specialServices: {
                                                lakeDelivery: true,
                                                ruralAccess: "Available",
                                                marketDaySchedule: "Flexible"
                                              }
                                            }
                                          ]
                                        },
                                      
                                        "Taita Taveta": {
                                          baseDeliveryTime: "1-2 days",
                                          zones: ["Mining", "Wildlife", "Urban"],
                                          stages: [
                                            {
                                              name: "Voi",
                                              fee: 800,
                                              peakFee: 1000,
                                              bulkDiscount: 150,
                                              estimatedTime: "1 day",
                                              instructions: "Park access permits available",
                                              landmarks: ["Tsavo East Gate", "Voi Wildlife Lodge"],
                                              pickupPoints: ["Voi Station", "Mwatate Junction"],
                                              specialServices: {
                                                mineAccess: true,
                                                parkDelivery: "Scheduled",
                                                gemTransport: "Secured"
                                              }
                                            }
                                          ]
                                        },
                                      
                                        "Tana River": {
                                          baseDeliveryTime: "2-3 days",
                                          zones: ["Riverine", "Delta", "Inland"],
                                          stages: [
                                            {
                                              name: "Hola",
                                              fee: 1200,
                                              peakFee: 1500,
                                              bulkDiscount: 200,
                                              estimatedTime: "2 days",
                                              instructions: "River crossing coordinated",
                                              landmarks: ["Hola Club", "Pumwani"],
                                              pickupPoints: ["Hola Market", "River Point"],
                                              specialServices: {
                                                boatTransfer: true,
                                                floodMonitoring: "Active",
                                                deltaAccess: "Seasonal"
                                              }
                                            }
                                          ]
                                        },
                                            "Tharaka Nithi": {
                                              baseDeliveryTime: "1-2 days",
                                              zones: ["Highland", "Urban", "Rural"],
                                              stages: [
                                                {
                                                  name: "Chuka",
                                                  fee: 800,
                                                  peakFee: 950,
                                                  bulkDiscount: 150,
                                                  estimatedTime: "1 day",
                                                  instructions: "Mountain route access",
                                                  landmarks: ["Chuka University", "Market"],
                                                  pickupPoints: ["Main Stage", "KTDA Factory"],
                                                  specialServices: {
                                                    teaCollection: true,
                                                    farmDelivery: "Available",
                                                    marketDayBonus: "10% off"
                                                  }
                                                }
                                              ]
                                            },
                                          
                                            "Trans Nzoia": {
                                              baseDeliveryTime: "1-2 days",
                                              zones: ["Agricultural", "Urban", "Forest"],
                                              stages: [
                                                {
                                                  name: "Kitale",
                                                  fee: 700,
                                                  peakFee: 850,
                                                  bulkDiscount: 120,
                                                  estimatedTime: "1 day",
                                                  instructions: "Grain handling available",
                                                  landmarks: ["Kitale Museum", "ASK Showground"],
                                                  pickupPoints: ["Bus Terminal", "National Cereals"],
                                                  specialServices: {
                                                    grainTransport: true,
                                                    farmEquipment: "Handled",
                                                    bulkAgri: "Specialized"
                                                  }
                                                }
                                              ]
                                            },
                                          
                                            Turkana: {
                                              baseDeliveryTime: "2-3 days",
                                              zones: ["Desert", "Lake", "Urban"],
                                              stages: [
                                                {
                                                  name: "Lodwar",
                                                  fee: 2000,
                                                  peakFee: 2500,
                                                  bulkDiscount: 300,
                                                  estimatedTime: "2 days",
                                                  instructions: "Desert-ready vehicles only",
                                                  landmarks: ["Lodwar Airstrip", "Lake Turkana"],
                                                  pickupPoints: ["Main Market", "Energy Centre"],
                                                  specialServices: {
                                                    desertNavigation: true,
                                                    lakeAccess: "Available",
                                                    oilFieldDelivery: "Specialized"
                                                  }
                                                }
                                              ]
                                            },
                                                "Uasin Gishu": {
                                                  baseDeliveryTime: "Same day - 1 day",
                                                  zones: ["Urban", "Agricultural", "Industrial"],
                                                  stages: [
                                                    {
                                                      name: "Eldoret CBD",
                                                      fee: 500,
                                                      peakFee: 650,
                                                      bulkDiscount: 100,
                                                      estimatedTime: "2-3 hours",
                                                      instructions: "24/7 delivery available",
                                                      landmarks: ["Eldoret Sports Club", "64 Stadium"],
                                                      pickupPoints: ["Main Post Office", "Uganda Road"],
                                                      specialServices: {
                                                        expressDelivery: true,
                                                        warehouseStorage: "Available",
                                                        bulkGrain: "Handled"
                                                      }
                                                    }
                                                  ]
                                                },
                                              
                                                Vihiga: {
                                                  baseDeliveryTime: "1-2 days",
                                                  zones: ["Highland", "Urban", "Rural"],
                                                  stages: [
                                                    {
                                                      name: "Mbale",
                                                      fee: 700,
                                                      peakFee: 850,
                                                      bulkDiscount: 120,
                                                      estimatedTime: "1 day",
                                                      instructions: "Tea zone access",
                                                      landmarks: ["County HQ", "Mbale Market"],
                                                      pickupPoints: ["Bus Park", "Rural Market"],
                                                      specialServices: {
                                                        ruralDelivery: true,
                                                        marketDayService: "Enhanced",
                                                        teaCollection: "Available"
                                                      }
                                                    }
                                                  ]
                                                },
                                              
                                                Wajir: {
                                                  baseDeliveryTime: "2-3 days",
                                                  zones: ["Arid", "Urban", "Border"],
                                                  stages: [
                                                    {
                                                      name: "Wajir Town",
                                                      fee: 1800,
                                                      peakFee: 2200,
                                                      bulkDiscount: 300,
                                                      estimatedTime: "2 days",
                                                      instructions: "Special desert vehicles only",
                                                      landmarks: ["Wajir Airport", "Central Market"],
                                                      pickupPoints: ["Main Stage", "Airport Road"],
                                                      specialServices: {
                                                        desertTracking: true,
                                                        securityEscort: "Available",
                                                        emergencyDelivery: "24/7"
                                                      }
                                                    }
                                                  ]
                                                },
                                                    "West Pokot": {
                                                      baseDeliveryTime: "2-3 days",
                                                      zones: ["Highland", "Pastoral", "Urban"],
                                                      stages: [
                                                        {
                                                          name: "Kapenguria",
                                                          fee: 1200,
                                                          peakFee: 1500,
                                                          bulkDiscount: 200,
                                                          estimatedTime: "2 days",
                                                          instructions: "Mountain terrain vehicles required",
                                                          landmarks: ["Kapenguria Museum", "Freedom Square"],
                                                          pickupPoints: ["Main Stage", "County Offices"],
                                                          specialServices: {
                                                            mountainDelivery: true,
                                                            pastoralRoutes: "Mapped",
                                                            culturalEvents: "Supported"
                                                          }
                                                        },
                                                        {
                                                          name: "Makutano",
                                                          fee: 1000,
                                                          peakFee: 1300,
                                                          bulkDiscount: 180,
                                                          estimatedTime: "1-2 days",
                                                          landmarks: ["Trading Center", "Junction Mall"],
                                                          pickupPoints: ["Bus Terminal", "Market Center"],
                                                          specialServices: {
                                                            tradingSupport: true,
                                                            marketAccess: "24/7"
                                                          }
                                                        }
]
 }
};
                                                export const TERRAIN_HANDLING = {
                                                    desert: {
                                                      vehicleType: "4x4 Specialized",
                                                      waterStations: "Mapped",
                                                      timeBuffer: "4 hours"
                                                    },
                                                    mountain: {
                                                      altitudeConsideration: true,
                                                      weatherMonitoring: "Real-time",
                                                      alternativeRoutes: "Available"
                                                    },
                                                    border: {
                                                      documentation: "Processed",
                                                      customsClearance: "Handled",
                                                      securityEscort: "Optional"
                                                    },
                                                }
                                                  
                                                  export const FINAL_DELIVERY_FEATURES = {
                                                    nationwide: {
                                                      tracking: "Real-time GPS",
                                                      insurance: "Comprehensive",
                                                      support: "24/7 Helpline"
                                                    },
                                                    specialHandling: {
                                                      fragile: "Extra protection",
                                                      perishable: "Temperature controlled",
                                                      valuable: "Secured transport"
                                                    },
                                                    customerService: {
                                                      contact: "Multiple channels",
                                                      feedback: "Instant response",
                                                      resolution: "Priority handling"
                                                    }
                                                  };
                                                  
                                                  export const DELIVERY_ANALYTICS = {
                                                    performanceTracking: true,
                                                    routeOptimization: "AI-powered",
                                                    customerFeedback: "Real-time",
                                                    qualityMetrics: "ISO standards"
                                                  };
                                                  
                                              
                                              export const SPECIALIZED_ZONES = {
                                                aridRegions: {
                                                  vehicleRequirements: "Heavy duty",
                                                  waterStations: "Mapped",
                                                  securityProtocol: "Active"
                                                },
                                                borderPoints: {
                                                  documentation: "Handled",
                                                  customsClearance: "Available",
                                                  securityChecks: "Standard"
                                                }
                                              };
                                              

                                        
                                          
                                          export const EXTREME_WEATHER_SERVICES = {
                                            desertOperations: {
                                              vehicleType: "Heavy-duty 4x4",
                                              waterStations: "Mapped",
                                              satelliteTracking: "Active"
                                            },
                                            emergencySupport: {
                                              response: "24/7",
                                              alternativeRoutes: "Available",
                                              supplies: "Stocked"
                                            }
                                          };
                                          
                                      
                                      export const RIVER_DELTA_SERVICES = {
                                        waterTransport: {
                                          boatTypes: ["Speed", "Cargo", "Emergency"],
                                          tideSchedule: "Monitored",
                                          safetyEquipment: "Provided",
                                        },
                                        seasonalPlanning: {
                                          floodAlerts: true,
                                          alternativeRoutes: "Mapped",
                                          emergencyResponse: "24/7",

                                    },
                                }
                                  export const HIGHLAND_SERVICES = {
                                    weatherMonitoring: {
                                      realTime: true,
                                      alternativeRoutes: "Available",
                                      delayNotifications: "Instant",
                                    },
                                    specializedVehicles: {
                                      type: "All-terrain",
                                      capacity: "Variable",
                                      weatherProof: true
                                    }
                                  };
                              export const COASTAL_SERVICES = {
                                portDelivery: {
                                  customsClearance: true,
                                  documentation: "Handled",
                                  storage: "Available"
                                },
                                islandTransfer: {
                                  boatService: "Scheduled",
                                  ferryPriority: true,
                                  weatherMonitoring: "Active"
                                },
                            }
                      export const SECURITY_ZONES = {
                        border: {
                          clearance: "Required",
                          escort: "Available",
                          restrictions: "Apply"
                        },
                        urban: {
                          standard: "Normal operations",
                          nightDelivery: "Available"
                        },
                        rural: {
                          tracking: "Mandatory",
                          timeWindow: "Daylight only"
                        },
                    }
                      
                  
                  export const TRANSPORT_MODES = {
                    road: {
                      standard: "Available nationwide",
                      express: "Major towns only",
                      tracking: "Real-time GPS"
                    },
                    water: {
                      coastal: "Regular schedules",
                      lake: "On demand",
                      insurance: "Included"
                    },
                    specialized: {
                      mountainous: "4x4 vehicles",
                      desert: "All-terrain vehicles",
                      island: "Boat services"
                    },
                
                  
              };
              
              export const WEATHER_CONSIDERATIONS = {
                rainy_season: {
                  additionalTime: "2-3 hours",
                  alternativeRoutes: true,
                  specialPackaging: "Waterproof"
                },
                dry_season: {
                  earlyDelivery: "Recommended",
                  temperatureControl: true,
                  specialHandling: "Heat sensitive items"
                },
              
        };
          
          export const SPECIALIZED_SERVICES = {
            express: {
              availability: "Major towns only",
              timeGuarantee: "3 hours or free",
              tracking: "Real-time GPS"
            },
            bulk: {
              minimumWeight: "50kg",
              discountRate: "15%",
              advanceBooking: "24 hours"
            },
            fragile: {
              specialPackaging: true,
              insurance: "Included",
              handlingInstructions: "Provided"
            }
          };
          
      
      
      export const REGIONAL_FEATURES = {
        highland: {
          weatherConsiderations: true,
          specialVehicles: "4x4 capability",
          timeBuffer: "Additional 2 hours"
        },
        coastal: {
          humidityProtection: true,
          marineTransport: "Available",
          customsHandling: "For port deliveries"
        },
        arid: {
          temperatureControl: true,
          waterproofPackaging: "Standard",
          earlyDelivery: "Recommended"
        }
      };
  export const DELIVERY_SERVICES = {
    standard: {
      tracking: "24-hour updates",
      insurance: "Basic coverage",
      packaging: "Standard"
    },
    express: {
      tracking: "Real-time",
      insurance: "Premium coverage",
      packaging: "Enhanced protection"
    },
    premium: {
      tracking: "Real-time with dedicated agent",
      insurance: "Comprehensive coverage",
      packaging: "Custom protective solutions"
    }
  };
  

export const SPECIAL_HANDLING = {
    fragile: {
      surcharge: "15%",
      packaging: "Extra padding provided",
      insurance: "Available"
    },
    perishable: {
      coldChain: true,
      maxTransitTime: "8 hours",
      specialVehicles: "Refrigerated vans"
    },
    bulky: {
      weightLimit: "100kg",
      dimensionLimits: "2m x 2m x 2m",
      specialEquipment: "Required"
    }
  };
  
  export const SEASONAL_ADJUSTMENTS = {
    rainy: {
      affected_counties: ["Kisii", "Nyamira", "Kakamega"],
      surcharge: "20%",
      special_notes: "Weather-dependent delivery times"
    },
    holiday: {
      nationwide: true,
      surcharge: "15%",
      advance_booking: "Required"
    }
  };
  
  export const DELIVERY_RULES = {
    peakHours: {
      morning: {
        start: "07:00",
        end: "09:00",
        surcharge: 50
      },
      evening: {
        start: "17:00",
        end: "20:00",
        surcharge: 100
      }
    },
    bulkOrders: {
      minimum: 10000,
      discount: "10%",
      specialHandling: true
    },
    seasonalRates: {
      christmas: {
        surcharge: "15%",
        period: "Dec 15 - Dec 31"
      },
      blackFriday: {
        discount: "20%",
        period: "Last Friday of November"
      }
    }
  };
  