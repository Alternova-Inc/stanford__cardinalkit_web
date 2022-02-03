---
home: false
title: Survey Creation
footer: Stanford Byers Center for Biodesign
---

CardinalKit allows you to create custom surveys that users can complete as many times as they want on the main screen, or schedule them to be filled on specific days or in a certain period, surveys can be assigned to a specific user or a study.

## 1) Create a survey

On the website after logging in as an administrator, in the sidebar locate the surveys section.

<img src="./images/Surveys/1-Sidebar.png" alt="drawing" width="450"/>

Here you will see the list of all the surveys that have been previously created, you can see details, edit and delete.

At the bottom click on Create new Survey.

<img src="./images/Surveys/2-Create.png" alt="drawing" width="950"/>

On the main screen of your application, the surveys are separated by sections indicating the title, subtitle and the name of the section where it will be located.
The order number indicates from top to bottom in which position you want it to appear.
Show on main screen whether or not you want it to appear on the main screen of the application.

Surveys are made up of several steps, these can be forms (one step with several questions on a single screen) or individual questions, each one displayed on a different screen.

<img src="./images/Surveys/3-form.png" alt="drawing" width="750"/>

### - Add a question

to add a question click on add question and select the type of question you want to add

All questions have a unique identifier and question text

<img src="./images/Surveys/4-addQUESTION.png" alt="drawing" width="450"/>

### - Create form.

To create a form click on add question and in the selectable list (Type Of Question) locate the option form.

<img src="./images/Surveys/5-SELECT.png" alt="drawing" width="750"/>

Enter the title and a description, the identifier will be a unique id that will serve to distinguish the questions in the database.

You can add all the questions you need by clicking on the Add Form question button and selecting the type of question

To add questions to a form, click on add form question.


## 2) Survey Types

<br />

#### Text: 
Create an open question with a single line text answer
#### Text Area: 
Create an open question with a text type answer with several lines to answer
#### Single Choice: 
Create a multiple choice question with a single answer
#### Multiple Choice: 
Create a multiple choice question with a choice of 1 or more
#### Form:
Create a form with several questions on a single page
#### Scale: 
Create a question with a numerical answer and a graphic scroll
#### Boolean: 
Create a question with a yes or no answer
#### Instruction: 
Create an instructions page can be displayed at the beginning of the entire questionnaire
#### Signature: 
Create a screen to collect a user's signature
#### Date: 
Create a question with a dated answer
#### Numeric: 
create a question with a numerical answer in a text box
#### E-mail: 
Create a field for email input
#### Location: 
Collect an address or location of the user
#### Text scale: 
Create a scale question with text values
#### TimeInterval: 
Create a question to answer with a time interval
#### Height: 
Pick up the user's height
#### Weigh: 
Pick up the weight of the user
#### Socioeconomic: 
Create a scale of socioeconomic levels for the user's choice
#### Continuous Scale: 
Create a numerical scale including decimal numbers
#### Picker: 
Create a select with multiple options
#### Summary: 
show the user a final message

<img src="./images/Surveys/6-example.png" alt="drawing" width="350"/>

<br />

<img src="./images/Surveys/7-example2.png" alt="drawing" width="350"/>

## 3) How to assign a survey for a study?

The surveys previously created in addition to being able to be filled from the main screen can be added to the calendar and to be filled in specific days or with periodically

To add a questionnaire to a complete study, on the survey page click on the scheduler button

<img src="./images/Surveys/8-scheduler.png" alt="drawing" width="650"/>

<br />
<br />

There you will see a calendar and a table with the currently assigned surveys
To assign a new one, click on the "Add survey to calendar" button.

<img src="./images/Surveys/9-calendar.png" alt="drawing" width="650"/>

<br />
<br />

A pop up will appear where you can indicate from which date to which date you want the survey to be filled in the interval of days that you want to pass from one occurrence to another

<img src="./images/Surveys/10-form.png" alt="drawing" width="650"/>

<br />
<br />

Finally a picker to select all the existing surveys and a short description that the user will read in the calendar of your application

## 4) How to assign a survey to a specific user?

In addition to assigning them to a complete study, you can assign surveys to specific users.

For this you must go to the studies section/Patients -> select the user to whom you want to add the survey by clicking the view button

<img src="./images/Surveys/11-surveyPatient.png" alt="drawing" width="650"/>

<br />
<br />

There you will see several sections of data including one called surveys, select it

<img src="./images/Surveys/12-select-survey.png" alt="drawing" width="650"/>

<br />
<br />

In this new screen you will be able to see the summary of all the responses that the user has had in front of the assigned surveys, click on scheduler to proceed to assign a new one.

<img src="./images/Surveys/13-scheduler.png" alt="drawing" width="650"/>

<br />
<br />

You will see the calendar and the table of assigned surveys press add survey to calendar and fill in the form in the same way that you filled it in to add the surveys to a study

<img src="./images/Surveys/14-form.png" alt="drawing" width="650"/>

 ## 5) Download Answers

cardinal kit offers the possibility to download all the responses of all users to a specific survey in a single csv file
go to the surveys tab and select the details button for a specific survey

<img src="./images/Surveys/15-edit.png" alt="drawing" width="650"/>

<br />
<br />

You will find the summary of all survey responses separated by question
click on the download button and you will get a csv file with all the answers organized

<img src="./images/Surveys/16-download.png" alt="drawing" width="650"/>  

<br />
<br />

<img src="./images/Surveys/17-example.png" alt="drawing" width="1050"/>  