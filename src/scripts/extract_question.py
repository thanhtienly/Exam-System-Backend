import sys
import re
import json
from multiprocessing import Process
import docx_to_txt
import os

def remove_empty_lines(text):
    lines = text.splitlines()  # Split the text into individual lines
    non_empty_lines = [line for line in lines if line.strip()]  # Filter out empty or whitespace-only lines
    return "\n".join(non_empty_lines)  # Join the remaining lines back with newlines

def reformat_frac(text):
    result = re.sub(r"\\frac", r'\\dfrac', text)
    return result

        
def delete_file_images (img_dict, img_dir):
    new_image = list(img_dict.values())
    new_image_path = []

    for image_name in new_image:
        image_path = os.path.join(img_dir, image_name)
        new_image_path.append(image_path)

    for image_path in new_image_path:
        if os.path.exists(image_path):
            try:
                os.remove(image_path)
            except:
                raise SystemError("Error when delete file")

def extract_mcq_part(text): 
    match = re.search(r"PHẦN I\.((?:(?!PHẦN II\.).)*)", text, re.S)
    if match:
        mcq_part = match.group(1)
        mcq_part = remove_empty_lines(mcq_part)
        return mcq_part
    return ''

def extract_tf_part(text): 
    match = re.search(r"PHẦN II\.((?:(?!PHẦN III\.).)*)", text, re.S)
    if match:
        tf_part = match.group(1)
        tf_part = remove_empty_lines(tf_part)
        return tf_part
    return ''

def extract_fb_part(text): 
    match = re.search(r"PHẦN III\.(.*)", text, re.S)
    if match:
        fb_part = match.group(1)
        fb_part = remove_empty_lines(fb_part)
        return fb_part
    return ''
    
def extract_mcq_question(mcq_part, img_dictionary = {}): 
    global current_image_index
    extracted_questions = []

    question_list = re.findall(r"(Câu [0-9]{1,2}\.\s(?:(?!Câu [0-9]{1,2}\.).)*)", mcq_part, re.S)
    for question in question_list:
        matches = list(re.findall(r"Câu ([0-9]{1,2})\.\s((?:(?!\s*\nA\.\s*(?:(?!\n).*)\s*\nB\.\s*(?:(?!\n).*)\s*\nC\.\s*(?:(?!\n).*)\s*\nD\.\s*(?:(?!\n).*)).)*)\s*\nA\.\s*((?:(?!\n).)*)\s*\nB\.\s*((?:(?!\n).)*)\s*\nC\.\s*((?:(?!\n).)*)\s*\nD\.\s*((?:(?!\n).)*)", question, re.S)[0])
        question_index = int(matches.__getitem__(0))
        question_text = matches.__getitem__(1)
        question_choices = matches[2:6]

        image_list = []
        question_images = re.findall(r"\<QuestionImage name=\"(?:(?!QuestionImage).)*\"\>", question, re.S)

        if question_images:
            for image in question_images:
                raw_image_name = re.findall(r"\<QuestionImage name=\"(.*)\"\>", image, re.S)[0]
                store_image_name = img_dictionary[raw_image_name]
                image_list.append(store_image_name)
        
        question_text = re.sub(r"\<QuestionImage name=\"(?:(?!QuestionImage).)*\"\>", "", question_text, count=0, flags=re.S)
        question_text = remove_empty_lines(question_text)

        extracted_questions.append({
            "index": question_index,
            "text": question_text,
            "type": "multiple_choice",
            "choices": question_choices,
            "images": image_list
        })

    return extracted_questions

def extract_tf_question(tf_part,  img_dictionary = {}):
    extracted_questions = []

    questionList = re.findall(r"(Câu [0-9]{1,2}\.\s(?:(?!Câu [0-9]{1,2}\.).)*)", tf_part, re.S)


    for question in questionList:
        matches = list(re.findall(r"Câu ([0-9]{1,2})\.\s((?:(?!\s*\na\)\s*(?:(?!\n).*)\s*\nb\)\s*(?:(?!\n).*)\s*\nc\)\s*(?:(?!\n).*)\s*\nd\)\s*(?:(?!\n).*)).)*)\s*\na\)\s*((?:(?!\n).)*)\s*\nb\)\s*((?:(?!\n).)*)\s*\nc\)\s*((?:(?!\n).)*)\s*\nd\)\s*((?:(?!\n).)*)", question, re.S)[0])
        question_index = int(matches.__getitem__(0))
        question_text = matches.__getitem__(1)
        question_statements = matches[2:6]

        image_list = []
        question_images = re.findall(r"\<QuestionImage name=\"(?:(?!QuestionImage).)*\"\>", question, re.S)

        if question_images:
            for image in question_images:
                raw_image_name = re.findall(r"\<QuestionImage name=\"(.*)\"\>", image, re.S)[0]
                store_image_name = img_dictionary[raw_image_name]
                image_list.append(store_image_name)
    
        question_text = re.sub(r"\<QuestionImage name=\"(?:(?!QuestionImage).)*\"\>", "", question_text, count=0, flags=re.S)
        question_text = remove_empty_lines(question_text)

        extracted_questions.append({
            "index": question_index,
            "text": question_text,
            "type": "statement",
            "statements": question_statements,
            "images": image_list
        });
    
    return extracted_questions

def extract_fb_question(fb_part,  img_dictionary = {}):
    extracted_questions = []

    questionList = re.findall(r"(Câu [0-9]{1,2}\.\s(?:(?!Câu [0-9]{1,2}\.).)*)", fb_part, re.S)

    for question in questionList:
        matches = list(re.findall(r"Câu ([0-9]{1,2})\.(.*)", question, re.S)[0])
        question_index = int(matches.__getitem__(0))
        question_text = matches.__getitem__(1)

        image_list = []
        question_images = re.findall(r"\<QuestionImage name=\"(?:(?!QuestionImage).)*\"\>", question, re.S)

        if question_images:
            for image in question_images:
                raw_image_name = re.findall(r"\<QuestionImage name=\"(.*)\"\>", image, re.S)[0]
                store_image_name = img_dictionary[raw_image_name]
                image_list.append(store_image_name)

        question_text = re.sub(r"\<QuestionImage name=\"(?:(?!QuestionImage).)*\"\>", "", question_text, count=0, flags=re.S)
        question_text = remove_empty_lines(question_text)

        extracted_questions.append({
            "index": question_index,
            "text": question_text,
            "type": "fill_blank",
            "images": image_list
        })

    return extracted_questions


def process_uploaded_file(file_path, img_dir):
    relationship_dict = docx_to_txt.get_relationship_dict(file_path)

    text = docx_to_txt.process(file_path, relationship_dict)
    text = remove_empty_lines(text)
    text = reformat_frac(text)

    mcq_part = extract_mcq_part(text)
    tf_part = extract_tf_part(text)
    fb_part = extract_fb_part(text)

    try:
        img_dict = docx_to_txt.extract_images(file_path, img_dir)

        mcq_questions = extract_mcq_question(mcq_part, img_dict)

        tf_questions = extract_tf_question(tf_part, img_dict)

        fb_questions = extract_fb_question(fb_part, img_dict)
    except:
        delete_file_images(img_dict, img_dir)
        raise SyntaxError("Error when extract question")
    
    questions = mcq_questions +  tf_questions + fb_questions

    if len(questions) == 0:
        delete_file_images(img_dict, img_dir)
        raise SyntaxError("Error when extract question")
    
    return questions

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.stderr.write("Parameter required is 3")
        sys.exit(1)
    else:
        file_name = sys.argv[1]
        img_dir = sys.argv[2]

        try: 
            result = process_uploaded_file(file_name, img_dir)
            result = json.dumps(result, ensure_ascii=False)
        except:
            sys.exit(1)
        sys.stdout.buffer.write(result.encode("utf-8"))
        sys.exit(0)
