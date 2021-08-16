import { app, update, query, sparqlEscapeUri, errorHandler } from 'mu';

app.get('/', function (req, res) {
  res.send('Hello mu-javascript-template');
});

app.delete('/:id', async function (req, res) {

  const meetingId = "http://data.lblod.info/id/zittingen/" + req.params.id;

  // Get all needed ids
  const query = `
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
    PREFIX dct: <http://purl.org/dc/terms/>
    DELETE{
      ?containerId ext:editorDocumentStatus ?statusId.
      ${sparqlEscapeUri(meetingId)} ?meetingP ?meetingO.
      ?apId ?apP ?apO.
      ?intermissionId ?intermissionP ?intermissionO.
      ?behandelingId ?behandelingP ?behandelingO.
      ?voteId ?voteP ?voteO.
    }
    INSERT{
      ?containerId ext:editorDocumentStatus <http://mu.semte.ch/application/concepts/a1974d071e6a47b69b85313ebdcef9f7>. 
    }
    WHERE {
      ${sparqlEscapeUri(meetingId)} ?meetingP ?meetingO.
      
      OPTIONAL{
        ${sparqlEscapeUri(meetingId)} besluit:behandelt ?apId.
        ?apId ?apP ?apO.
      }
      OPTIONAL{
        ${sparqlEscapeUri(meetingId)} ext:hasIntermission ?intermissionId.
        ?intermissionId ?intermissionP ?intermissionO.
      } 
      OPTIONAL{
        ?behandelingId dct:subject ?apId.
        ?behandelingId ?behandelingP ?behandelingO.
      }
      OPTIONAL{ 
        ?behandelingId besluit:heeftStemming ?voteId.
        ?voteId ?voteP ?voteO.
      }
      OPTIONAL{
        ?behandelingId ext:hasDocumentContainer ?containerId.
        ?containerId ext:editorDocumentStatus ?statusId.
      }
    }
  `;
  try {
    const result = await update(query);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
    return;
  }
});

app.use(errorHandler);