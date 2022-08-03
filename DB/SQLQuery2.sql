use testDB


begin tran test;

insert into dateTest(datetimee)values (CURRENT_TIMESTAMP)

if (4>2)
rollback tran test
else
commit tran test;

select datetimee from datetest;
