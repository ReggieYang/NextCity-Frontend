<template>
    <div class="user">
        <Button type="ghost" @click="update" icon="paper-airplane" style="float:right;width:11%">Update Profile</Button>
        <h1 @click="changeName" v-if="!editName"
            style="text-align: center; margin-bottom: 20px; color: #2d8cf0; padding-left:11%">{{ user.name }}</h1>
        <Input v-model="user.name"
               style="width:22%; padding-left:11%; margin-bottom: 20px" size="large"
               v-if="editName"></Input>
        <div class="head">
            <div class="line"></div>
            <span>Address</span>
        </div>
        <div class="content">
            <span v-if="!edit" @click="changeAddress">{{ user.address }}</span>
            <Input v-model="user.address" style="width:10%" size="large"
                   v-if="edit"></Input>
        </div>

        <div class="head">
            <div class="line"></div>
            <span>Skills</span>
        </div>
        <div class="content">
            <div class="show">
                <Tag type="dot" color="green" v-for="item in user.skill" :key="item"
                     :name="item" closable @on-close="closeSkill">{{ item }}
                </Tag>
                <Input v-model="newSkill" id="new-skill"
                       style="width: 8%;"></Input>
                <Button type="dashed" icon="plus-round" @click="addSkill"></Button>
            </div>
        </div>

        <div class="head">
            <div class="line"></div>
            <span>Preferences</span>
        </div>
        <div class="content">
            <div class="show">
                <Tag type="dot" color="blue" v-for="item in user.main_pref" :key="item">{{ item }}</Tag>
            </div>
            <div class="show" style="margin-top: 10px;">
                <Tag type="dot" color="blue" v-for="item in user.other_pref" :key="item">{{ item }}</Tag>
            </div>
        </div>

        <div class="head">
            <div class="line"></div>
            <span>Recommendation</span>
        </div>
        <div class="content">
            <div class="show">
                <Tag type="dot" color="yellow" v-for="city in recCity" :key="city">{{ city }}</Tag>
            </div>
        </div>

    </div>
</template>

<script>
    import Api from "@/api";

    export default {
        name: "user",
        data: function () {
            return {
                user: {},
                recCity: [],
                newSkill: "",
                cityList: ["Houston", "Boston"],
                currentCity: "",
                edit: false,
                editName: false
            };
        },
        methods: {
            changeName() {
                this.editName = !this.editName;
            },
            changeAddress() {
                this.edit = !this.edit;
            },
            update() {
                localStorage.user = JSON.stringify(this.user);
                $.ajax({
                    type: "POST",
                    url: Api.updateUserUrl,
                    datatype: "json",
                    data: JSON.stringify(this.user),
                    contentType: "application/json"
                });
                this.$Notice.open({
                    title: "You've updated your profile.",
                    duration: 1
                });
                this.edit = false;
                this.editName = false;
            },
            addSkill() {
                this.user.skill.push(this.newSkill);
                this.newSkill = "";
            },
            closeSkill(event, name) {
                const index = this.user.skill.indexOf(name);
                this.user.skill.splice(index, 1);
            }
        },
        created() {
            this.user = JSON.parse(localStorage.user);
            this.user.main_pref = this.user.main_pref.map(x =>
                x.replace(new RegExp("-|_", "g"), " ")
            );
            this.user.other_pref = this.user.other_pref.map(x =>
                x.replace(new RegExp("-|_", "g"), " ")
            );
            this.currentCity = this.user.address;

            $.get(
                Api.getRecCityUrl + "?email=" + this.user.email + "&list_size=5"
            ).done(res => {
                this.recCity = JSON.parse(res);
            });
        }
    };
</script>

<style scoped>
    .user {
        text-align: left;
        text-align: center;
        margin: 0 auto;
    }

    .item {
        margin-bottom: 20px;
    }

    .title {
        text-align: right;
        font-size: 18px;
        font-weight: bold;
    }

    .value {
        font-size: 18px;
        font-weight: bold;
    }

    .head {
        text-align: center;
        position: relative;
    }

    .head span {
        font-size: 18px;
        padding: 0 10px;
        background-color: white;
        position: relative;
    }

    .head .line {
        border-top: 1px solid #dddee1;
        position: absolute;
        top: 13px;
        width: 100%;
    }

    .content {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin: 20px 0 40px 0;
    }

    .content .show {
        width: 60%;
        margin: 0 auto;
    }
</style>