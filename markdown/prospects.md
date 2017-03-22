
## <a name="prospects">Prospects Domain</a>

#### 1.0 Use Cases

For the sales activities around the prospect domain, we expect that there is not much difference between how the brokers and agents work. So, how do we create and update prospects and how much information do we have about the prospect? Possibilities include:

* Prospects are manually created
* The contact details are copied from the mobile phone or third-party application
* In the case of agents, the prospect could be “pushed” from the insurer (e.g. there was a road show and some people left their business card for follow up)

The secondary question is how much information does the agent/broker have about the prospect and how much information does the agent/broker want to save?

* The agent/broker starts with minimal information and they progressively get more information with each subsequent interaction
* The agent/broker are able to get very detailed information from the prospect, as the prospect is ready for a quotation or proposal.

On the question of how much information should we keep, at this point in time, our expectation is that the sales intermediary (agent/broker) would keep information that would ease the downstream activities, i.e. FNA, Quotation & Proposal. There could be other information that would be useful to managing the relationship with the prospect, and these can be accommodated using the extension fields, i.e. these would be considered as part of local customizations. There is also the consideration about how much information the intermediary is willing to share, i.e. the expectation is that they would **not** be willing to enter in information that does not help them in the downstream activities.

Based on the above, we anticipate the front-end application would have the following capabilities:

* Manual creation of prospect record

  * We expect that the front-end application will have UIs built to allow for the maintenance of the prospect information.

  * Defaulting values to reduce data entry and errors
    * On mobile devices, a possible option is to import the prospect data from the device contacts. This is under the control of the front-end application to default the relevant fields to the prospect maintenance screen. With the imported information, the prospect record can be created using the cloud API.
    * Yet another possibility is the front-end application is part of a larger suite of applications (e.g. CRM) and the information about the prospect can be “copied” from third-party services. This function is also under the control of the front-end application, and in a similar fashion, the prospect record can then be created using the eBao Cloud services.

  * The availability of the prospect information
    * We expect that there will be cases where the prospect may be prepared to provide more information, as they would like to get a quotation or submit a proposal. In other cases, only minimal information may be available as the intermediary has only a business card. Additional information is added with each interaction that the intermediary has with the prospect. As such the cloud service must allow for creation of prospects with only minimal information, probably name, mobile number, and gender.
    * However, such a prospect record would not be useful for the downstream insurance activities, e.g. quotation or proposal entry. As a result, there is a need to provide a cloud service to do “lazy” validation on the prospect record when the prospect record is used for the downstream insurance processes, e.g. to check on the eligibility of the prospect for a quotation. (Please refer to the quotation domain for the usage of this service)
    * Due to the progressive nature of the prospect information, we expect the front-end application to organize the prospect information into various sections e.g. basic information, address information, personal information and family information. Basic information would include information required for a quote, whereas personal information and address information is used for proposals and FNAs. Family information is useful for third party quotation / proposals. The relevant sections of the prospect record are updated as the information become available.

* Prospect records are assigned by the insurer
  * One possible manifestation of this functionality is that upon login to the front-end app, the user (agent in this case) is notified via a dashboard or popup that there are prospects to be assigned to him/her.
  * The user acknowledges and the front-end app will download the list of prospect assignments for previewing. The user may accept in bulk or selectively (as there are usually obligations that the agent needs to fulfill before the prospect is assigned to them).
  * The front-end app will then trigger the cloud API for bulk creation of the selected prospects under the agent.
  * If we look at this transaction from a different perspective, i.e. that of the insurer, then we would need to provide a cloud service to upload the list of prospects into the platform. This would be a bulk transaction for the assignment of prospects. These assignments will have an expiry date i.e. the intermediaries must take up with assignment before the expiry date.
  * A separate cloud service would also be required to get a list of the prospects “not taken up” at the end of the assignment period, so that they could be re-assigned.

#### 2.0 Sequence Diagrams

Based on the above, let us look at how the eBao Cloud services can be leveraged by a front-end application to allow for the maintenance of prospect information.

##### 2.1 Manual creation of prospects
  The intermediary wants to create a new prospects and starts by checking to see if the prospect (e.g. Albert) already exists. The search prospects UI is used to search the prospects database. Upon finding that the prospect record does not exist, the intermediary decides to add a new prospect. The basic information panel is presented by the front-end application. The user then enters the minimum information required to create a new prospect i.e. Name, Gender, Mobile Number.  The user then taps on the save button in the front-end application.  A message is presented to notify that the prospect record has been successfully created.



```puml

actor User
participant "Front End" as F
participant "eBao Cloud" as ebao
User -> F : Search prospects
activate F
F -> ebao : GET /prospects?filter=prospectName*startsWith*Albert
activate ebao
ebao --> F : HTTP 200 []
deactivate ebao
F --> User : No prospects found
User -> F : New prospect
F --> User : Display contact UI (Basic)
User -> F : Enter name, gender, mobile number. Tap Save
F -> ebao : POST /prospects/\n{prospectName: 'Albert Tan', gender: 'Male', mobileNumber: '+8678928292' }
activate ebao
ebao --> F : HTTP 200 {prospectId:10001, prospectName:'Albert Tan',....}
deactivate ebao
F --> User : Prospect created successfully
deactivate F

```
  If the client application provided insufficient data to create the prospect record, the cloud API would return an error response instead e.g. if the mobile number if not provided in the request to create a new prospect
  ```puml

  actor User
  participant "Front End" as F
  participant "eBao Cloud" as ebao
  User -> F : Search prospects
  activate F
  F -> ebao : GET /prospects?filter=prospectName*startsWith*Albert
  activate ebao
  ebao --> F : HTTP 200 []
  deactivate ebao
  F --> User: No prospects found
  User -> F : New prospect
  F --> User : Display contact UI (Basic)
  User -> F : Enter name, gender. Tap Save
  F -> ebao : POST /prospects/\n{prospectName: 'Albert Tan', gender: 'Male'}
  activate ebao
  ebao --> F : HTTP 400  { errors: [{ message: "Mobile number is required.", field: "mobileNumber" }] }
  deactivate ebao
  F --> User : Mobile number is required
  deactivate F

  ```
  Please note that the response HTTP status code is 400 which means that this is a user data error.

  A slight variation to the scenario is where the the prospect data is imported from the mobile device or from a third party service (e.g. CRM). In such a scenario, the front-end client application will need to implement additional functionality for the import. However, there is no impact to the eBao cloud service. The sequence diagram may look like the following:

  ```puml
  actor User
  participant "Front End" as F
  participant "eBao Cloud" as ebao
  User -> F : Search prospects
  activate F
  F -> ebao : GET /prospects?filter=prospectName*startsWith*Albert
  activate ebao
  ebao --> F : HTTP 200 []
  deactivate ebao
  F --> User: No prospects found
  User -> F : New prospect
  F --> User : Display contact UI (Basic)
  User -> F : Tap on import contact "Albert Tan"
  F -> F : Default the prospect values (name and mobile number)
  F --> User : Display the defaulted values
  User -> F : Select the gender for the prospect. Tap save.
  F -> ebao : POST /prospects/\n{prospectName: 'Albert Tan', gender: 'Male', mobileNumber: +861788912990, email: 'albert200@gmail.com'}
  activate ebao
  ebao --> F : HTTP 200 {prospectId:10001, prospectName:'Albert Tan',....}
  deactivate ebao
  F --> User : Prospect created successfully
  deactivate F
  ```

##### 2.2 Update of prospect information

  Continuing with the prospect, the intermediary has met up with Albert and he has agreed to a provide additional information about himself so that the intermediary can prepare a quotation for him. Since it is only for a quotation, only the basic information is required. The smoker status, occupation and birth date information was provided. The intermediary uses the front-end application to retrieve the prospect document for Albert Tan, so that the additional information can be updated into the prospect record.

  ```puml
  actor User
  participant "Front End" as F
  participant "eBao Cloud" as ebao
  User -> F : Search prospects
  activate F
  F -> ebao : GET /prospects?filter=prospectName*startsWith*Albert%20Tan
  activate ebao
  ebao --> F : HTTP 200 [{prospectId:10001, prospectName: "Albert Tan",version:1, ...}]
  deactivate ebao

  User -> F : Select prospect 10001 for editing
  F -> ebao : GET /prospects/10001
  activate ebao
  ebao --> F : HTTP 200 {prospectId:10001, prospectName: "Albert Tan",version:1,...}
  deactivate ebao
  F --> User : Display contact UI (Basic) for Albert Tan
  User -> F : Enter birthDate. Tap calculate age
  F -> ebao : GET /prospects/age?ageMethod=ANB&birthDate=1980-05-12
  activate ebao
  ebao --> F : HTTP 200 { age: 27 }
  deactivate ebao
  F --> User : Display age as 27
  User -> F : Enter smoker status, occupation. Tap Save.
  F -> ebao : PUT /prospects/10001\n{prospectName: 'Albert Tan', \ngender: 'Male', mobileNumber: '+8678928292', \nsmoker: "Non-Smoker", occupation:"200" , version: 1 }
  activate ebao
  ebao --> F : HTTP 200 {prospectId:10001, prospectName:'Albert Tan',version:2,....}
  deactivate ebao
  F --> User : Prospect updated successfully
  deactivate F
```

If Albert had been interested in a proposal, he would have needed to provide additional information, e.g. his nationality, religion, residential addresses, marital status, employment status etc, i.e. his personal data. The sequence diagram to show how the information is stored is still the same as the one above, i.e. we retrieve the record, enter the new information and tap on save.

##### 2.3 Deletion of prospect document

An alternate outcome could be that Albert is totally not interested in buying any insurance, and thus the intermediary decides to remove the prospect record in the system. The will be some controls for the removal of prospect data, e.g. if there exists quotations for the prospect, the deletion would not be allowed. In this case, there is no activity for Albert and his prospect record can be deleted.

```puml
actor User
participant "Front End" as F
participant "eBao Cloud" as ebao
User -> F : Search prospects
activate F
F -> ebao : GET /prospects?filter=prospectName*startsWith*Albert%20Tan
activate ebao
ebao --> F : HTTP 200 [{prospectId:10001, prospectName: "Albert Tan",version:1, ...}]
deactivate ebao
F --> User: Display list of prospects
User -> F : Select prospect 10001 for editing
F -> ebao : GET /prospects/10001
activate ebao
ebao --> F : HTTP 200 {prospectId:10001, prospectName: "Albert Tan", version:1,...}
deactivate ebao
F --> User : Display prospect details for Albert Tan
User -> F : Tap on delete icon
F --> User : "Please confirm Deletion"
User -> F : "Yes"
F -> ebao : DELETE /prospects/10001?version=1
activate ebao
ebao --> F : HTTP 200 { message: "Prospect record deleted"  }
deactivate ebao
F --> User : Prospect record was successfully deleted
deactivate F
```

In the use cases described above, the conversation between the front-end application and the eBao Cloud service is as follows :

* fetch a list of prospect records
* select one prospect record to fetch full information
* save changes / delete the selected prospect record

If it is considered that there is a need to reduce the "chattiness" of the conversation with the eBao Cloud services, an alternate implementation could be as follows:

* fetch a list of detailed prospect records (but limit to only 10 rows)
* save changes / delete the selected prospect record

The idea is to fetch full information about each prospect up-front instead of just the selected prospect. However, we limit the number of rows to reduce the payload size.

In such a case, the sequence diagram for the deletion of the Albert Tan prospect record would be as follows:

```puml

actor User
participant "Front End" as F
participant "eBao Cloud" as ebao
User -> F : Search prospects "Albert Tan"
activate F
F -> ebao : POST /prospects/detailed\n?filter=prospectName*startsWith*Albert%20Tan&offset=0&limit=10
activate ebao
ebao --> F : HTTP 200 [{prospectId:10001, prospectName: "Albert Tan",version:1, ...}]
deactivate ebao
F --> User: Display list of prospects ( rows 1-10 )
User -> F : Select prospect 10001 for editing
F --> User : Display prospect details for Albert Tan\n(use information retrieved earlier)
User -> F : Tap on delete icon
F --> User : "Please confirm Deletion"
User -> F : "Yes"
F -> ebao : DELETE /prospects/10001?version=1
activate ebao
ebao --> F : HTTP 200 {message: "Prospect record deleted"}
deactivate ebao
F --> User : Prospect record was successfully deleted
deactivate F

```

##### 2.4 Bulk creation of prospects

Thus far, we have been looking at creating and maintenance of the prospect record individually, i.e. one at a time. As discussed earlier, there may be cases where the prospect data is assigned by the insurer and for the purpose of efficiency and performance, it may be better to allow for the bulk creation of the prospect record.

In such a scenario, we start from the insurer's perspective, i.e. they have a list of prospect records which they have assigned to their agents. For the purpose of this discussion, we will assume that the insurer has an application that can communicate with the eBao Cloud service.

```puml

participant "Insurer App" as ins
participant "eBao Cloud" as ebao

ins -> ebao : POST /assignments/_bulk\n[ {operation:'CREATE', doc:{assignmentType:"Prospect", data: { prospectName: "Lin Dan", agent: "agent007",..},...}},\n  {operation:'CREATE', doc:{assignmentType:"Prospect", data: {prospectName: "Lu Kai", agent: "agent007", ..}...}}...\n]
activate ins
activate ebao
ebao --> ins : HTTP 200 [{pk: 2000, assignmentType:"Prospect", data:{prospectName: "Lin Dan", agent:"agent007",...}},\n  {pk: 2001, assignmentType:"Prospect", data:{prospectName: "Lu Kai", agent:"agent007",...}}]
deactivate ebao
deactivate ins

```

With this operation, the assignments are stored on the platform. As an example, imagine that the front-end application has a dashboard that is displayed upon login and it includes information about the assignment of prospects to the user. In such a scenario, the user (agent007), can choose to preview the assignments before accepting the assignments.

```puml

actor User
participant "Front End" as F
participant "eBao Cloud" as ebao

User -> F : Preview assignments
activate F
F -> ebao : GET /assignments?filter=assignmentType*eq*Prospect
activate ebao
ebao --> F : HTTP 200 [{pk: 2000, assignmentType:"Prospect", data:{prospectName: "Lin Dan", agent:"agent007",..}},\n {pk: 2001, assignmentType:"Prospect", data:{prospectName: "Lu Kai", agent:"agent007",..}},..]
deactivate ebao
F --> User : Display assignments
User -> F : Select Lin Dan ,Lu Kai.\nAccept.
F -> ebao: POST /prospects/_bulk \n[{operation:'CREATE', assignmentId:2000, doc: \n {prospectName: "Lin Dan", mobileNumber: 12837122, gender:Male,..}}\n {operation:'CREATE', assignmentId:2001, doc: \n {prospectName: "Lu Kai", mobileNumber: "12839943", gender: "Male",..}}..]
activate ebao
ebao -> ebao : Update assignments\n(accepted).\nCreate prospects
ebao --> F : HTTP 200 \n[{pk: 3000, prospectName: "Lin Dan", agent:"agent007",...},\n {pk: 3001, prospectName: "Lu Kai", agent:"agent007",...}...]
deactivate ebao
F --> User: New prospects created
deactivate F

```

To complete the loop, there may be cases of assignments which are not accepted by the intermediary. In such cases, after the expiry date of the assignments, the insurer may wish to retrieve the assignments that were "not taken up" (expired) and re-assign them.

```puml

participant "Insurer App" as ins
participant "eBao Cloud" as ebao

ins -> ebao : GET /assignments?filter=expired*eq*true
activate ins
activate ebao
ebao --> ins :  HTTP 200 [{pk: 2000, assignmentType:"Prospect", prospectName: "Rudy Hartono", agent:"agent009",...}]
deactivate ebao
ins -> ins : Store the list of expired assignments locally
deactivate ins

```
