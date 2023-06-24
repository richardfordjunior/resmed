
let arrayList = []
module.exports.save = (data) => {
  arrayList.push(data)
  return arrayList
}
module.exports.cache = arrayList;
