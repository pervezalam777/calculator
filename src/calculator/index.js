// const input = `
// [7:46 pm, 11/11/2021] Amreen: 2000
// [7:47 pm, 11/11/2021] Amreen: Milk
// Egg
// Fruit
// Vegetable
// [7:53 pm, 11/11/2021] Nafees Bhai: Deemak ka tail 350
// [7:53 pm, 11/11/2021] Nafees Bhai: Vegetables 250
// [7:55 pm, 11/11/2021] Nafees Bhai: Vineger brown and white, butter and refind oil = 280
// [8:29 pm, 11/11/2021] Nafees Bhai: Ghee 400~
// [8:05 am, 12/11/2021] Pervez: Deemak tail, matti ka tail 440
// [11:52 am, 12/11/2021] Pervez: Chicken 560
// [0:03 pm, 12/11/2021] Amreen: 1000
// [7:53 am, 13/11/2021] Amreen: Atta
// Oil
// Surf
// Dishwash bar
// Bathing soap
// 2730
// [3:35 pm, 13/11/2021] Nafees Bhai: Gosht or paaye 650
// [7:13 pm, 13/11/2021] Pervez: 10000 credit
// [7:33 pm, 13/11/2021] Nafees Bhai: 20000 credit
// [7:33 pm, 13/11/2021] Nafees Bhai: Received 2000
// [7:51 pm, 13/11/2021] Amreen: 5700 recieved
// [10:01 pm, 13/11/2021] Amreen: 300 milk and egg
// 300 recieved
// [8:13 am, 14/11/2021] Pervez: 278 aata
// [1:40 pm, 16/11/2021] Nafees Bhai: 260 khana
// [1:41 pm, 16/11/2021] Nafees Bhai: 210 besan, dahi or megi
// [1:52 pm, 16/11/2021] Pervez: deemak ka tail 350
// [2:04 pm, 16/11/2021] Amreen: Cylinder*
// [4:57 pm, 16/11/2021] Pervez: Use keyword GK, if you are paying from ghar kharch.. not from your pocket..
// [4:58 pm, 16/11/2021] Amreen: Gk
// [7:14 pm, 16/11/2021] Nafees Bhai: Gk
// [7:14 pm, 16/11/2021] Nafees Bhai: Gk
// [11:18 am, 17/11/2021] Amreen: 100 brocoli gk
// [5:31 pm, 17/11/2021] Amreen: 515 milk, red chilli and green chilli .. Gk
// [8:25 pm, 17/11/2021] Pervez: Banana orange apples 240
// [4:07 pm, 18/11/2021] Amreen: 1690 vegetable,sugar,tea, pulses, besan, harpic.. Gk
// [9:07 pm, 18/11/2021] Amreen: 300 cable Gk
// [2:24 pm, 19/11/2021] Amreen: 810 milk, egg, vegetable Gk
// [8:00 pm, 19/11/2021] Nafees Bhai: 930 tanduri chicken, nahari, roti.   Gk
// [1:28 pm, 20/11/2021] Amreen: 300 milk Gk
// [7:22 pm, 21/11/2021] Nafees Bhai: 300 milk gk
// [7:23 pm, 21/11/2021] Nafees Bhai: 140 namkeen, Biscuits, frooti
// [7:23 pm, 21/11/2021] Nafees Bhai: 60 Maggie
// [7:23 pm, 21/11/2021] Nafees Bhai: Gk
// [7:23 pm, 21/11/2021] Nafees Bhai: Gk
// [5:15 pm, 23/11/2021] Amreen: 500 milk Gk
// [5:16 pm, 23/11/2021] Amreen: 500 electric things and gobhi Gk
// [9:08 pm, 24/11/2021] Pervez: 520 fish, 50 banana
// [9:09 pm, 24/11/2021] Nafees Bhai: 400 biryani
// [9:09 pm, 24/11/2021] Nafees Bhai: Gk
// [9:10 pm, 24/11/2021] Nafees Bhai: 300 ac dismantle
// [9:10 pm, 24/11/2021] Nafees Bhai: Gk
// [9:57 pm, 24/11/2021] Amreen: 280 atta Gk
// [7:47 pm, 25/11/2021] Amreen: 500 milk Gk
// [8:47 pm, 25/11/2021] Pervez: 30 dahi
// [7:26 pm, 26/11/2021] Nafees Bhai: 160 nahari or roti
// [7:26 pm, 26/11/2021] Nafees Bhai: Gk
// [8:07 pm, 26/11/2021] Amreen: 500 milk and egg Gk
// [0:38 pm, 28/11/2021] Nafees Bhai: 420 vegetables
// 90 honitus
// 180 chicken
// GK
// [2:36 pm, 28/11/2021] Amreen: 260 milk,matar Gk
// `

//const ignoreText = 'Use keyword GK, if you are paying from ghar kharch.. not from your pocket..';

let result = null;

export function processRawData(input) {
  try {
    result = replaceNewLineOnForSameMessage(input);
    result = extractEachRecords(result);
    result = segregatePerPerson(result);
    mergeRecordsWithAmount(result);
    mergeRecordsWithGK(result);
    adjustContraEntries(result);
    extractAndAddAmountEntries(result);
    result = separateEntriesForGkOwnPaidReceived(result);
    console.log('result', result);
    return true;
  } catch(error) {
    return false;
  }
}

function replaceNewLineOnForSameMessage(input) {
    let result = input.replaceAll('\n', ' ');
    result = result.replaceAll('[', '\n[');
    return result;
}

function extractEachRecords(input) {
    const regexForRecordsExtraction = /\[[^\n].*/gmi
    return input.match(regexForRecordsExtraction)
}


function segregatePerPerson(input) {
    return input.reduce((finalResult, nextRow) => {
        const [date, nameDescription] = nextRow.split('] ');
        const [name, description] = nameDescription.split(':');

        const entriesForName = finalResult[name] || [];
        entriesForName.push({date: date.replace('[', ''), description: description.trim()});
        finalResult[name] = entriesForName;
        return finalResult;
    }, {})
}

function mergeRecordsWithAmount(input) {
  Object.values(input).forEach(entries => {
      let len = entries.length;
      let onlyNumberFlag = false;
      for(let i = 0; i < len; i++) {
          const entry = entries[i];
          const { description } = entry;
          const onlyTextFlag = containsOnlyText(description);
          if(onlyNumberFlag && onlyTextFlag){
              const previousEntry = entries[i -1];
              previousEntry.description += ` ${description}`;
              entry.markForDeletion = true;
          }
          onlyNumberFlag =  isNumber(description)
      }
  })  
}

function containsOnlyText(value) {
    return !containsNumber(value);
}

function containsNumber(value) {
    const regexForOnlyText = /[0-9].*/
    return regexForOnlyText.test(value);
}

function isNumber(value) {
    return !isNaN(value)
}

function mergeRecordsWithGK(input) {
    Object.values(input).forEach(entries => {
        let len = entries.length;
        for(let i = 0; i < len; i++) {
            const entry = entries[i];
            const { description } = entry;
            const gkFlag = containsOnlyGK(description);
            let j = i;
            while(j > -1 && gkFlag){
                j -= 1;
                const previousEntry = entries[j];
                const noGK = shouldNotHaveGK(previousEntry.description);
                const hasAmount = getAmount(previousEntry.description)
                if(noGK && hasAmount > 0) {
                    previousEntry.description += ' GK';
                    entry.markForDeletion = true;
                    break;
                }
            }
        }
    })
}

function containsOnlyGK(value) {
    const regexForOnlyGK = /^gk$/i;
    return regexForOnlyGK.test(value);
}

function shouldNotHaveGK(value) {
    const regexForGK = /gk/i
    return !regexForGK.test(value);
}

function getAmount(value) {
    const regexForAmount = /\d+/g;
    const result = value.match(regexForAmount)
    if(result){
       return result.reduce((sum, value) => sum +(+value), 0);
    }
    return 0
}

function adjustContraEntries(input) {
    Object.values(input).forEach(entries => {
        let len = entries.length;
        const partOfContraEntries = [];
        for(let i = 0; i < len; i++) {
            const entry = entries[i];
            const { description } = entry;
            const contraObject = hasContraEntry(description);
            if(contraObject.isContraEntry) {
                // ['', ' milk and egg ', ' recieved']
                // TODO: Revise following logic later
                var splitDes = description.split(contraObject.amounts[0])
                entry.description = `${splitDes[1]} ${contraObject.amounts[0]} contra**`
                entry.contra = true;
                partOfContraEntries.push({
                    ...entry,
                    description: `${splitDes[2]} ${contraObject.amounts[0]} contra**`,
                    contra: true
                })
            }
        }
        entries.push(...partOfContraEntries);
    })
}

function hasContraEntry(value) {
    const regexForAmount = /\d+/g;
    const result = value.match(regexForAmount);
    const hasReceivedKeyword = containsReceived(value);
    // NOTE: this logic may require refinement if
    // it has multiple contra entries in single statement
    if(result && result.length % 2 === 0 && hasReceivedKeyword){
        return { isContraEntry:true, amounts:result }
    }
    return { isContraEntry: false, amounts: [] }
}

function containsReceived(value) {
    const regexForReceived = /rec(ei|ie)ved/gi;
    return regexForReceived.test(value);
}

function extractAndAddAmountEntries(input) {
    Object.values(input).forEach(entries => {
        entries.forEach(entry => {
            entry.amount = getAmount(entry.description)
        })
    })
}



function separateEntriesForGkOwnPaidReceived(input){
    const finalResult = {}
    Object.entries(input).forEach(([key, entries]) => {
        const expectedObject = {gk:[], own:[], received:[], paid:[]};
        entries.forEach(entry => {
            const {description} = entry;
            if (containsGgInText(description)) {
                expectedObject.gk.push({...entry});
            } else if (containsReceived(description)) {
                expectedObject.received.push({...entry});
            } else if (containsPaid(description)) {
                expectedObject.paid.push({...entry});
            } else {
                expectedObject.own.push({...entry});
            }
        })
        finalResult[key] = expectedObject;
    })
    return finalResult;
}

function containsGgInText(value) {
    const regexForGK = /gk/i
    return regexForGK.test(value);
}

function containsPaid(value) {
    const regexForCredited = /credit(ed)?/gi;
    return regexForCredited.test(value)
}


export function houseExpenseBy(name) {
    const gkValues = result[name] && result[name].gk;
    if(gkValues) {
        return gkValues.reduce((sum, entry) => sum + entry.amount, 0);
    }
    return 0;
}

export function paidFromOwnPocket(name) {
    const gkValues = result[name] && result[name].own;
    if(gkValues) {
        return gkValues.reduce((sum, entry) => sum + entry.amount, 0);
    }
    return 0;
}

export function receivedBy(name) {
    const gkValues = result[name] && result[name].received;
    if(gkValues) {
        return gkValues.reduce((sum, entry) => sum + entry.amount, 0);
    }
    return 0;
}

export function paidBy(name) {
    const gkValues = result[name] && result[name].paid;
    if(gkValues) {
        return gkValues.reduce((sum, entry) => sum + entry.amount, 0);
    }
    return 0;
}

export function totalHouseExpense() {
    return Object
        .values(result)
        .reduce((sum, entries) => {
            let innerSum = entries.gk.reduce((total, entry) => total + entry.amount, 0);
            innerSum += entries.own.reduce((total, entry) => total + entry.amount, 0);
            return sum + innerSum;
        }, 0)
}

export function getPersonList() {
  return (result && Object.keys(result)) || [];
}

export function getTabularFormat() {
    return Object.entries(result).reduce(
        (result, [person, personData]) => {
            const innerProcessedResult = Object.entries(personData).reduce(
                (innerResult, [paymentMode, paymentModeValues]) => {
                    paymentModeValues.forEach(item => {
                        if(item.markForDeletion !== true) {
                            innerResult.push({paymentMode, by: person, ...item})
                        }
                    })
                    return innerResult
                },
                []
            )
            return [...result, ...innerProcessedResult]
        },
        []
    )
}
/*
[pervez]: {
    GK: [
        {amount: '', description: '', date: ''}
    ]
    own: : [
        {amount: '', description: '', date: ''}
    ],
    received: [
        {amount: '', description: '', date: ''}
    ],
    paid: [
        {amount: '', description: '', date: ''}
    ]
}
*/

