<template>
    <div>
        <p style="font-family: 'Microsoft YaHei'; font-size: 30px">Explore Your Next City</p>
        <Form :model="form" class="login-form">
            <FormItem label="Email">
                <Input v-model="form.email" type="email" placeholder="Enter email..."></Input>
            </FormItem>
            <FormItem label="Password">
                <Input v-model="form.password" type="password" placeholder="Enter password..."></Input>
            </FormItem>
            <Button type="ghost" @click="login">sign in</Button>
            <Button type="ghost" @click="signup">sign up</Button>
        </Form>
    </div>
</template>

<script>
    import Input from "iview/src/components/input/input";
    import Api from "@/api";

    export default {
        components: {Input},
        name: "login",
        data() {
            return {
                form: {
                    email: "",
                    password: ""
                }
            };
        },
        methods: {
            signup() {
                $.ajax({
                    type: "POST",
                    url: Api.signupUrl,
                    dataType: "json",
                    data: this.form,
                    success: res => {
                        this.$Notice.info({
                            title: "You've signed up to NextCity.",
                            duration: 3
                        });
                    }
                });
            },

            login() {
                $.ajax({
                    type: "POST",
                    url: Api.loginUrl,
                    dataType: "json",
                    data: this.form,
                    success: res => {
                        if (!res) {
                            this.$Notice.error({
                                title: "Log in failed.",
                                duration: 3
                            });
                        } else {
                            localStorage.user = JSON.stringify(res);
                            $.ajax({
                                type: "GET",
                                url: Api.getCityUrl,
                                dataType: "json",
                                data: {city_name: res.address},
                                success: res2 => {
                                    localStorage.city = JSON.stringify(res2);
                                    this.$router.push("/User");
                                }
                            });
                        }
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .login-form {
        text-align: center;
        width: 40%;
        margin: 0 auto;
    }
</style>