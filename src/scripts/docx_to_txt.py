# my_docx_to_text.py
import argparse
import re
import xml.etree.ElementTree as ET
import zipfile
import os
import sys
from pathlib import Path
from lxml import etree


nsmap = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}


def process_args():
    parser = argparse.ArgumentParser(description='A pure python-based utility '
                                                 'to extract text and images '
                                                 'from docx files.')
    parser.add_argument("docx", help="path of the docx file")
    parser.add_argument('-i', '--img_dir', help='path of directory '
                                                'to extract images')

    args = parser.parse_args()

    if not os.path.exists(args.docx):
        print('File {} does not exist.'.format(args.docx))
        sys.exit(1)

    if args.img_dir is not None:
        if not os.path.exists(args.img_dir):
            try:
                os.makedirs(args.img_dir)
            except OSError:
                print("Unable to create img_dir {}".format(args.img_dir))
                sys.exit(1)
    return args


def qn(tag):
    """
    Stands for 'qualified name', a utility function to turn a namespace
    prefixed tag name into a Clark-notation qualified tag name for lxml. For
    example, ``qn('p:cSld')`` returns ``'{http://schemas.../main}cSld'``.
    Source: https://github.com/python-openxml/python-docx/
    """
    prefix, tagroot = tag.split(':')
    uri = nsmap[prefix]
    return '{{{}}}{}'.format(uri, tagroot)


def xml2text(xml, relationship_dict):
    """
    A string representing the textual content of this run, with content
    child elements like ``<w:tab/>`` translated to their Python
    equivalent.
    Adapted from: https://github.com/python-openxml/python-docx/
    """
    text = u''
    root = ET.fromstring(xml)

    for child in root.iter():
        if child.tag == qn('w:t'):
            t_text = child.text
            text += t_text if t_text is not None else ''
        elif child.tag == qn('w:tab'):
            text += '\t'
        elif child.tag in (qn('w:br'), qn('w:cr')):
            text += '\n'
        elif child.tag == qn("w:p"):
            text += '\n\n'
        elif child.tag == qn("w:drawing"):
            xml_text = ET.tostring(child, encoding='unicode')
            match = re.findall(r"\:embed=\"((?:(?!\").)*)\"", xml_text, re.S)
            embedId=""
            if match:
                embedId = match[0]
                raw_image_name = relationship_dict[embedId]

                text += f'<QuestionImage name="{raw_image_name}">'

    return text


def process(docx, relationship_dict):
    text = u''

    # unzip the docx in memory
    zipf = zipfile.ZipFile(docx)
    filelist = zipf.namelist()

    # get header text
    # there can be 3 header files in the zip
    header_xmls = 'word/header[0-9]*.xml'
    for fname in filelist:
        if re.match(header_xmls, fname):
            text += xml2text(zipf.read(fname))

    # get main text
    doc_xml = 'word/document.xml'
    text += xml2text(zipf.read(doc_xml), relationship_dict)

    # get footer text
    # there can be 3 footer files in the zip
    footer_xmls = 'word/footer[0-9]*.xml'
    for fname in filelist:
        if re.match(footer_xmls, fname):
            text += xml2text(zipf.read(fname))

    zipf.close()
    return text.strip()

def get_relationship_dict(file_path):
    relationships = {}
    try:
        with zipfile.ZipFile(file_path, 'r') as docx_archive:
            if 'word/_rels/document.xml.rels' in docx_archive.namelist():
                rels_content = docx_archive.read('word/_rels/document.xml.rels')
                root = ET.fromstring(rels_content)

                # Define the namespace for relationships
                ns = {'rels': 'http://schemas.openxmlformats.org/package/2006/relationships'}

                # Iterate through 'Relationship' elements
                for rel_element in root.findall('rels:Relationship', ns):
                    r_id = rel_element.get('Id')
                    r_target = rel_element.get('Target')
                    r_target = os.path.basename(r_target)

                    relationships[r_id] = r_target
    except FileNotFoundError:
        print(f"Error: DOCX file not found at {file_path}")
    except Exception as e:
        print(f"An error occurred during parsing: {e}")

    return relationships


def extract_images(file_path, img_dir=None):
    img_dictionary = {}
    file_name = os.path.basename(file_path)
    
    # unzip the docx in memory
    zipf = zipfile.ZipFile(file_path)
    filelist = zipf.namelist()
 
    if img_dir is not None:
        if not os.path.exists(img_dir):
            os.makedirs(img_dir)

        # extract images
        for fname in filelist:
            _, extension = os.path.splitext(fname)
            if extension in [".jpg", ".jpeg", ".png", ".bmp"]:
                img_name = file_name + " - " +  os.path.basename(fname)
                dst_fname = os.path.join(img_dir, img_name)

                with open(dst_fname, "wb") as dst_f:
                    dst_f.write(zipf.read(fname))
                    
                img_dictionary[os.path.basename(fname)] = img_name

    zipf.close()
    return img_dictionary
                

if __name__ == '__main__':
    args = process_args()
    text = process(args.docx, args.img_dir)
    sys.stdout.write(text.encode('utf-8'))
