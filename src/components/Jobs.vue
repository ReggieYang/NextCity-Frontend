<template>
    <div>
        <Row>
            <Col span="14">
            <div id="map">map is here</div>
            <div class="jobs">
                <div class="job" v-for="(job, idx) in jobs" :key="idx" @click="changeCity(job)">
                    <Card>
                        <Button type="success" shape="circle" style="float: right;" v-if="job.status"
                                @click.stop="toggleFollow(job)">
                            Following
                        </Button>
                        <Button type="ghost" shape="circle" style="float: right;" v-if="!job.status"
                                @click.stop="toggleFollow(job)">
                            Follow
                        </Button>
                        <a class="name" :href="job.link" target="_blank">{{ job.title }}</a>
                        <p class="company">{{ job.company }}</p>
                        <p class="address" @click="jobByCity(job.city)">{{ job.city }}, {{ job.state }}</p>
                        <p class="description">{{ job.description }}</p>
                    </Card>
                </div>
            </div>
            </Col>
            <Col span="10">
            <Affix :offset-top="80">
                <div style="text-align:right">
                    <Input v-model="keywords" style="width: 30%"></Input>
                    <Button type="ghost" shape="circle" icon="ios-search" @click="jobByKw(keywords)"
                            style="margin-left: 10px; margin-right: 10px;"></Button>
                </div>
                <div id="chart" style="height: 550px; margin-top:5px"></div>
                <div class="followCity">
                    <Button type="ghost" shape="circle" icon="star" v-if="followCity" @click="followCity = false">{{
                        activeCity }}
                    </Button>
                    <Button type="success" shape="circle" icon="star" v-else @click="followCity = true">{{ activeCity
                        }}
                    </Button>
                </div>
            </Affix>
            </Col>
        </Row>
    </div>
</template>

<script>
    import echarts from "echarts";
    import Api from "@/api";

    export default {
        name: "jobs",
        data: function () {
            return {
                jobs: [],
                keywords: "",
                activeCity: "",
                currentCity: "",
                followCity: true,
                cityData: {},
                columns: [
                    "Education",
                    "Female Ratio",
                    "Traffic",
                    "Crime",
                    "Cost of Living",
                    "Climate",
                    "Pollution",
                    "Health Care",
                    "Cuisine"
                ]
            };
        },
        methods: {
            jobByKw(keywords) {
                $.get(Api.jobByKwUrl + "?kw=" + keywords).done(res => {
                    this.jobs = JSON.parse(res);
                });
            },
            parseCamel(name) {
                return name
                    .toLowerCase()
                    .split(" ")
                    .join("_");
            },
            jobByCity(city) {
                $.get(Api.jobByCityUrl + "?city_name=" + city).done(res => {
                    this.jobs = JSON.parse(res);
                });
            },
            retrieveValueFromData(keys, data) {
                return keys.map(key => data[this.parseCamel(key)]);
            },
            toggleFollow(job) {
                var email = JSON.parse(localStorage.user).email;
                $.get(Api.setFavoriteJobsUrl + "?email=" + email + "&job_id=" + job.id);
                job.status = !job.status;
            },
            changeCity(job) {
                // this.chart = echarts.getInstanceByDom(document.getElementById('chart'));
                this.retrieveData(job.city);
                this.activeCity = job.city;
                this.followCity = true;
            },
            retrieveData(city) {
                $.get(Api.getCityUrl + "?city_name=" + city).done(data => {
                    var res = JSON.parse(data);
                    var option = {
                        legend: {
                            data: [this.currentCity, city]
                        },
                        series: [
                            {
                                name: this.currentCity,
                                type: "bar",
                                data: this.retrieveValueFromData(this.columns, this.cityData)
                            },
                            {
                                name: city,
                                type: "bar",
                                data: this.retrieveValueFromData(this.columns, res)
                            }
                        ]
                    };
                    this.chart.setOption(option);
                });
            }
        },
        created() {
            this.currentCity = JSON.parse(localStorage.user).address;
            this.cityData = JSON.parse(localStorage.city);

            $.get(Api.getJobsUrl).done(data => {
                var res = JSON.parse(data);
                res.forEach(val => {
                    val.status = false;
                });
                this.jobs = res;
            });
        },
        mounted() {
            function loadScript(url, callback) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                if (typeof callback != "undefined") {
                    if (script.readyState) {
                        script.onreadystatechange = function () {
                            if (
                                script.readyState == "loaded" ||
                                script.readyState == "complete"
                            ) {
                                script.onreadystatechange = null;
                                callback();
                            }
                        };
                    } else {
                        script.onload = function () {
                            callback();
                        };
                    }
                }
                script.src = url;
                document.body.appendChild(script);
            }

            loadScript("/static/map.js", function () {
            });
            loadScript(
                "https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAP_KEY&callback=initMap&language=en",
                function () {
                }
            );

            this.chart = echarts.init(document.getElementById("chart"));
            var option = {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow"
                    }
                },
                legend: {
                    data: [this.currentCity, ""],
                    right: 20
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: {
                    type: "value"
                    // boundaryGap: ['5%', '5%']
                },
                yAxis: {
                    type: "category",
                    data: this.columns
                },
                series: [
                    {
                        name: this.currentCity,
                        type: "bar",
                        data: this.retrieveValueFromData(this.columns, this.cityData),
                        label: {
                            normal: {
                                show: true,
                                position: "right"
                            }
                        }
                    },
                    {
                        name: "",
                        type: "bar",
                        label: {
                            normal: {
                                show: true,
                                position: "right"
                            }
                        }
                    }
                ]
            };
            this.chart.setOption(option);
        }
    };
</script>

<style scoped>
    #map {
        height: 300px;
        margin-bottom: 20px;
    }

    .job {
        text-align: left;
        margin-bottom: 10px;
    }

    .job .name {
        font-size: 18px;
        font-weight: bold;
        color: #2d8cf0;
    }

    .job .company {
        font-size: 16px;
    }

    .job .address {
        font-size: 15px;
        color: #aaa;
    }

    .job .description {
        font-size: 15px;
        margin-top: 5px;
    }

    .followCity {
        position: absolute;
        top: 0px;
        left: 20px;
    }
</style>
