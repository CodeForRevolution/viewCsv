const Filename = require('../model/filename');
const fs = require('fs');//requiring fs for creating a file and reading the file
const { array } = require('../config/multer');
const mongoose = require('mongoose');
const express = require('express');; 
const csv = require('csv-parser'); //for the converting and reading csv file
const Dynamic = require('../model/newschema');  //





module.exports.home = async function (req, res) {

  const File = await Filename.find({});
  res.render('home.ejs', {
    File: File
  });

}


module.exports.upload = async function (req, res) {

if(req.fileValidationError){
  console.log('uploaded file should be only csv file')
  req.flash('error','UPloaded file should be in CSV');
  return res.redirect('/');

}

  try {
    let file = await Filename.create({  
      name: req.file.originalname,    //saving origin file name to show the user which file they want to see in tabular form  
      pathName: req.file.filename,   //assining the file path in FILename for further use of csv file when required
      csvPath: ''
    })

  
    const Array = [];
    fs.createReadStream(`./upload/${file.pathName}`)
      .pipe(csv())                    //from csv file making a collection of csv file data
      .on('data', async (row) => {
        var columnNames = Object.keys(row);
        var columnValues = Object.values(row);
        Array.push(row);
      })

      .on('end', async () => {
        var column = Object.keys(Array[0]);
        const newfile = await Dynamic.create({ data: Array, column: column });
        file.csvPath = newfile._id;
        file.save();   
      })


      req.flash('success','csv file uploaded');
      return res.redirect('back');

  } catch (error) {
    console.log('you got the error',error);
   return res.redirect('back')

  }


}





module.exports.view = async function (req, res) {

  try {

    let file = await Filename.findById(req.params.id);
    const newfile = await Dynamic.findById(file.csvPath)

    var page = req.query.page || 1;   //if req.query.page will have any data then page will get that data other wise deault value for page is 1 assigned
    var limit = 23;  //no of record will be showed in one page is assingning
    if (req.query.field != undefined && req.query.field != '') {
      const nw = newfile.data.sort(
        function (a, b) {

          if (a[req.query.field].toUpperCase() > b[req.query.field].toUpperCase()) {  //converting input data to csv data to avoid the case sensitiveness
            var a = -1;
            if (req.query.order == 'Assending') {
              a = 1
            }
            return a;      //  according to the user input setting which sorting should be done
          }
          else {
            var b = 1
            if (req.query.order == 'Assending') { 
              b = -1;
            }
            return b;
          }

        }
      )


    }

    if (req.query.field_search != undefined && req.query.field_search != '') {//checking all the query value to avvoid the null or undefined input 
      var filter = newfile.data.filter(function (a) {
        if (a[req.query.field_search].toLowerCase().includes(req.query.search.toLowerCase())) {
          return a;
        }
      })
      newfile.data = filter;//adding the filtered data to the newfile.data
    }





    var totalPage = Math.ceil((newfile.data.length) / limit);

    if (page > totalPage) {
      page = 1
    }
    if (page < 1) {            //if previous button reach page less than one the it will directed to last page
      page = totalPage;
    }

    const startIndex = (page - 1) * limit;
    if(totalPage>20){
      totalPage=1               //    setting if data will to big then pagination will not apply
      limit=Infinity;
    }
    const finalData = newfile.data.slice(startIndex, startIndex + limit);//extracting only selected amount of data for the view according to the limit

    var field = req.query.field || '';
    var order = req.query.order || '';                //setting all the field which wil require for the pagination
    var field_search = req.query.field_search || '';
    var search = req.query.search || '';


    var Next = Number(Number(page) + 1);
    console.log('you nexxt', Next);
    var Prev = page - 1;
    console.log('you nexxt', Prev);
    res.render('view', {
      Data: finalData,
      columnName: newfile.column,
      page: page,
      totalPage: totalPage,
      order: order,
      field: field,
      field_search, field_search,       //sending all the fields which will require for the pagination
      Next: Next,
      Prev: Prev,
      search: search

    })


  } catch (error) {

    console.log(error)
    res.redirect('/')
  }
}


module.exports.delete = async function (req, res) {

  try {


    let file = await Filename.findById(req.params.id);//finding the file document which hava id of document of csv schema document
    fs.unlinkSync(`./upload/${file.pathName}`);
    await Dynamic.deleteOne({ _id: file.csvPath });//delete csv file which was upload and now requested to delete
    let one = await Filename.deleteOne({ _id: req.params.id });//deleting the file document 
    req.flash('success','file is delete');
    return res.redirect('back');
 

  } catch (error) {

    console.log('error', error);
    res.redirect('back');

  }
}







