async function Analyse() {
    const input = document.getElementById("upload_file");
    const Div_result = document.getElementById('result');
    const selectedFile = input.files[0];

    const formData = new FormData();
    formData.append("file", selectedFile);


    if(!selectedFile) {
        Div_result.style.display = 'block';
        Div_result.className = 'error';
        Div_result.innerText = 'Please chose a file to analyse';
        return ;
    }
    try{
        const repons = await fetch("/upload", {
            method: "POST",
            body: formData
        })
    

        if(!repons.ok){

            const error_data = await repons.json();
            
            Div_result.style.display = 'block';
            Div_result.className = 'error';
            Div_result.innerText = `Error : ${error_data.detail || 'invalid input'}`;
            return ;
        }
        const data = await repons.json()

        let column_text = ''
        for (columns_name in data.columns_name){
            column_text += `<p>${data.columns_name[columns_name]}</p>`
        }

        let missing_text = ''
        for (const columns in data.missing_values){
            missing_text += `<p>${columns} : ${data.missing_values[columns]}</p>`
        }

        let data_type = ''
        for (const columns_type in data.data_types){
            data_type += `<p>${columns_type} : ${data.data_types[columns_type]}</p>`
            }

        Div_result.style.display = 'block';
        Div_result.className = 'success';
        Div_result.innerHTML =` <p> uploading succeeded : ${data.message} </p> 
                                <h3> -------------------- 📁 Dataset Summary -------------------- </h3> 
                                        <p> File name  : ${data.File_name} </p>
                                        <p> Number of lines : ${data.nb_lines} </p>
                                        <p> Number of columns : ${data.nb_columns} </p>
                                <h3> -------------------- 📋 Columns -------------------- </h3> 
                                    ${column_text} 
                                <h3> --------------------- ⚠️ Missing Values --------------------- </h3>
                                    ${missing_text}    
                                <h3> --------------------- 🔧 Data Types --------------------- </h3>
                                    ${data_type}
                                <h3> ---------------------🗐 Duplicate rows --------------------- </h3>
                                <p>Number of duplicated rows : ${data.duplicate_rows} </p>
                                `;
                                
    }
    catch(error) {
        Div_result.style.display = 'block';
        Div_result.className = 'error';
        Div_result.innerText = 'could not connect to the server api .';
    }
}