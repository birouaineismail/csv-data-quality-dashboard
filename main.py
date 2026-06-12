from fastapi import FastAPI,UploadFile,File
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import pandas as pd
from fastapi import HTTPException
from pandas.errors import EmptyDataError

app = FastAPI()

app.mount('/static',StaticFiles(directory='static'),name='static')

@app.get('/')
def home_page() :
    return FileResponse('templates/index.html')

@app.post('/upload')
def upload(file : UploadFile = File(...)) :
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed"
        )    
    try:
        df = pd.read_csv(file.file)
    except EmptyDataError:
        raise HTTPException(
            status_code=400,
            detail="The CSV file is empty"
            )
    file_name = file.filename
    info = df.shape
    columns_name = df.columns.to_list()
    data_types = {col: str(dtype) for col, dtype in df.dtypes.to_dict().items()}
    
    duplicate_rows = int(df.duplicated().sum())

    return {
            'message': 'data received',
            'File_name': file_name,
            'nb_lines' : info[0],
            'nb_columns' : info[1],
            'columns_name' : columns_name,
            'missing_values': df.isnull().sum().to_dict(),
            'data_types' : data_types,
            'duplicate_rows' : duplicate_rows
            }