const inputText = document.querySelector('input[type="text"]')
const imageInput = document.querySelector('input[type="file"]')
const send = document.querySelector('.send')


//取得畫面資料
const getAllDatas = async ()=>{
    
    const response = await fetch('/upload');
    const data = await response.json();

    //each data
    for (const item of data.data){
        const newDiv = document.createElement('div');
        const textDiv = document.createElement('div');
        const newImg = document.createElement('img');
        const imgDiv = document.createElement('div');
        const newHr = document.createElement('hr');
        textDiv.textContent = item.message;
        newImg.src = item.img;
        
        imgDiv.appendChild(newImg);
        newDiv.appendChild(textDiv);
        newDiv.appendChild(imgDiv);
        document.body.appendChild(newDiv);
        document.body.appendChild(newHr);
    }      
};


window.onload = () => {
    getAllDatas();
};

//點擊後，資料傳入後端
send.addEventListener("click", async ()=>{
    uploadDatas();  
})


//上傳圖文資料
const uploadDatas = async ()=>{
    // event.preventDefault()
    const text = inputText.value;
    const file = imageInput.files[0]
    console.log(text,file)

    let formData = new FormData();
    formData.append('message', text);
    formData.append('file', file);
    
    const response = await fetch('/upload',{
        method:'POST',
        body:formData           
    });
    const data = await response.json();
    window.location.href = '/';
}



