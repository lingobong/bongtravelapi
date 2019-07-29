const mongoose = require('mongoose')
const LSM = require('lingo-search-mongodb')({
     db: mongoose,
     modelName: 'LingoSearch_Journal',
})
function journalWrite(journal) {
     let texts = []

     texts.push({
          text: journal.title,
          score: 100,
     })
     if (journal.description) {
          texts.push({
               text: journal.description,
               score: 10,
          })
     }
     return LSM.insert(texts, {
          unique_key: journal._id,
          payload: {
               journal: journal._id,
          },
     })
}

function journalSearch(keyword, skip, lastKeywords) {
     let texts = []

     texts.push({
          text: keyword,
          score: 100,
     })
     try {
          for (let i = 0; i < lastKeywords.length; i++) {
               texts.push({
                    text: lastKeywords[i],
                    score: 15 - i * 5,
               })
          }
     } catch (e) { }

     let postAggregate = (aggregate) => {
          aggregate.push({
               $lookup: {
                    from: 'traveljournals',
                    localField: 'payload.journal',
                    foreignField: '_id',
                    as: 'journal'
               }
          })
          aggregate.push({
               $unwind: '$journal'
          })
          aggregate.push({
               $addFields: {
                    'journal.picture': {
                         $arrayElemAt: ['$journal.pictures', 0]
                    },
                    'journal.pictures': null
               }
          })
     }

     return LSM.search(texts, {
          postAggregate,
          skip,
          limit: 20,
     }).then(rs => rs.map(item => item.journal))
}

module.exports = {
     journalWrite,
     journalSearch,
}