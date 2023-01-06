
export const DeleteAllData = async({commit})=>{
    let refGet = await request.GET(`studies/com.alternova.example/users/6K5Lu5rIV2Yz0sM2DWKUsGBLXlG2/healthKit`).WHERE(["payload","!=","null"]).Execute()
    refGet.docs.forEach(async(element) => {
      let newref= request.DELETE(`studies/com.alternova.example/users/6K5Lu5rIV2Yz0sM2DWKUsGBLXlG2/healthKit`,{docId:element.id}) 
      await newref.Execute() 
    });
  }
  
  export const ReviewDates = async({commit})=>{
    let refGet = await request.GET(`studies/com.alternova.example/users/B6VFnXBGPXbqiB4wilm9NkrxD7F2/healthKit`).WHERE(["header.creation_date_time",">","0"]).Execute()
    refGet.docs.forEach(async(element) => {
      let stringDate = element.data()['header']['creation_date_time']
      let dateJs = new Date(stringDate)
      let dateFirebase = timeTransform.fromDate(dateJs)
      let newref= request.PATH(`studies/com.alternova.example/users/B6VFnXBGPXbqiB4wilm9NkrxD7F2/healthKit/${element.id}`,
      {
        header:{
          creation_date_time_p:stringDate,
          creation_date_time:dateFirebase
        }
      }) 
      await newref.Execute() 
    });
  }