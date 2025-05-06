const express = require('express');
const cors = require ('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/',async(req,res)=>{
    try{
        res.json('WELCOME TO STUDENT API');
    }
    catch(err){
        res.status(500).json({Error:err.message});
    }
})
app.get('/student', async(req,res)=>{
    try{
        const result = await pool.query('select * from student');
        res.json(result.rows);
    
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});



app.get('/student', async(req,res)=>{
    try{
        const result = await pool.query('select count(Id)from student');
        res.json(result.rows);
    
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});


app.get('/regions',async(req,res)=>{
    try{
const result = await pool.query(`select r.region_name,c.country_name,l.city from regions r 
    join countries c on r.region_id = c.region_id join locations l on
     c.country_id = l.country_id`)

        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})


app.get('/countries',async(req,res)=>{
    try{
const result = await pool.query (`select c.country_name, r.region_name, l.city from countries c
     join regions r on c.region_id = r.region_id join locations l on c.country_id = l.country_id`)

        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})

app.get('/locations',async(req,res)=>{
    try{
const result = await pool.query (`select l.city, c.country_name, r.region_name from locations l join
     countries c on l.country_id = c.country_id join regions r on c.region_id = r.region_id`)


        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})


app.get('/departments',async(req,res)=>{
    try{
const result = await pool.query (`select d.department_name, e.first_name, e.last_name, 
    l.city from departments d join employees e on  d.department_id = e.department_id join 
    locations l on d.location_id = l.location_id`)

        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})

app.get('/employees',async(req,res)=>{
    try{
const result = await pool.query (`select e.first_name, e.last_name, d.department_name, l.city, 
    c.country_name  from employees e join departments d on e.department_id = d.department_id  join 
    locations l on d.location_id = l.location_id  join countries c on l.country_id = c.country_id`)

        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})


app.get('/names',async(req,res)=>{
    try{
const result = await pool.query (`select e.first_name, e.last_name, m.first_name as manager_first, 
    m.last_name as manager_last, d.department_name, l.city  from employees e  join employees m on
     e.manager_id = m.employee_id  join departments d on e.department_id = d.department_id  join locations 
     l on d.location_id = l.location_id `)

        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})


app.get('/job_titles',async(req,res)=>{
    try{
const result = await pool.query (`select e.first_name, e.last_name, j.job_title,
     d.department_name, l.city  from employees e  join jobs j on e.job_id = j.job_id  
     join departments d on e.department_id = d.department_id  join locations l on d.location_id = l.location_id `)
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})



app.get('/titles',async(req,res)=>{
    try{
const result = await pool.query (`select e.first_name, e.last_name, j.job_title,
     d.department_name, m.first_name as manager_first, m.last_name as manager_last,
      l.city  from employees e  join jobs j on e.job_id = j.job_id  join departments 
      d on e.department_id = d.department_id  join employees m on e.manager_id = m.employee_id 
       join locations l on d.location_id = l.location_id `)

        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})

app.get('/region_id',async(req,res)=>{
    try{
const result = await pool.query ('select country_name from countries where region_id = 1; ')
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})

app.get('/cities',async(req,res)=>{
    try{
const result = await pool.query (`select d.department_name  from departments d  join locations
     l on d.location_id = l.location_id  where l.city like 'n%' `)
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})


app.get('/commission_pct',async(req,res)=>{
    try{
const result = await pool.query (`select e.* from employees e join departments 
    d on e.department_id = d.department_id join employees m on d.manager_id = m.employee_id 
    where m.commission_pct > 0.15`)
    D
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})


app.get('/job_id',async(req,res)=>{
    try{
const result = await pool.query (`select distinct job_id from employees
     where employee_id in (select manager_id from departments where manager_id is not null)`)
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})



app.get('/postal_codes',async(req,res)=>{
    try{
const result = await pool.query (` select l.postal_code from locations l join 
    countries c on l.country_id = c.country_id join regions r on c.region_id = r.region_id where
     r.region_name = 'Asia' `)

        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})


app.get('/department_id',async(req,res)=>{
    try{
const result = await pool.query (`select distinct d.department_name from 
    departments d join employees e on d.department_id = e.department_id where
     e.commission_pct < (  select avg(commission_pct) from employees where commission_pct is not null )`)
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})

app.get('/average',async(req,res)=>{
    try{
const result = await pool.query (`select e.first_name, e.last_name,e.job_id from
     employees e where e.salary > ( select avg(salary) from employees e2 
     where e2.department_id = e.department_id )`)
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})

app.get('/jobs',async(req,res)=>{
    try{
const result = await pool.query (` select * from jobs `)

        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})

app.get('/count_emp',async(req,res)=>{
    try{
const result = await pool.query (`select count(*) from employees`);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})

app.get('/count_jobs',async(req,res)=>{
    try{
const result = await pool.query (`select count(*) from jobs`);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})
app.get('/count_region',async(req,res)=>{
    try{
const result = await pool.query (`select count(*) from regions`);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})

app.get('/count_location',async(req,res)=>{
    try{
const result = await pool.query (`select count(*) from locations`);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})

app.get('/count_dept',async(req,res)=>{
    try{
const result = await pool.query (`select count(*) from departments`);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})

app.get('/count_job_history',async(req,res)=>{
    try{
const result = await pool.query (`select count(*) from job_history`);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
})





const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`connected successfully.... Running on PORT ${PORT}`);
});