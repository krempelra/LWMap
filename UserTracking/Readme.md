#User Tracking

The structure of the database is in the SQL-File [UserTracking.sql](UserTracking.sql).

The database-user has to have _INSERT_ and _SELECT_ permissions. No data is deleted or altered in the design.

## Tracking Units

There are units which are allways the same over the database. 

* Timestamp -> Unix Timestamp
* URI -> Wikipedia URI
* User -> Hash of User same as in Cookie
* VisHash -> Has Of A Visualisation
* SharingUser ->  see User a User Hash
* Search -> Sting
* Succsess -> Boolean if a Lookup was Successfull
* New -> Number if a Visualisation is New or Not If its just a Redo it is simple
* FocusOpen -> 0 If Node is Focused and 1 if Node is Opend


## Tracking Events

There are Several Events tracked by the System.

#### CheckURI 

In the frontend uris can be Verified for retrieval

Timestamp, User, Search, URI, Success

#### Create 

The Creation of a New Visualisation
Information

Timestamp, Vishash ,URI1, URI2, URI3, URI4, URI5, User, New

#### CreateFinished 

The time a created Visualisation is finished and Ready

Timestamp, Vishash

#### OpenVisualisation

A user opens a Visualisation

Timestamp, VisHash, User, SharingUser 

#### ClickVisualisation 

Register Clicks on Indivudual Nodes in the Visualisation

Timestamp, Vishash,User, URI, FocusOpen







