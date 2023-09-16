const express = require("express");
const menuData = require("./menu_task_data");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("menu_task", {menuData: menuData});
});
 console.log(menuData);  
app.listen(8000, () => {
    console.log("server at 8000")
}); 