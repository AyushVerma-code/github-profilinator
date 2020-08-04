import React from 'react';
import { Input, Row, Col, Button, Dropdown, Menu, Form } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../styles/fields.module.scss';
import { faBold, faItalic, faUnderline, faHeading, faTimes, faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { FieldProps } from '.';

export enum IMAGE_ALIGNMENT {
    LEFT = 'left',
    CENTRE = 'center',
    RIGHT = 'right',
}

export interface ImageFieldOptions {
    height?: string;
    width?: string;
    alignment?: IMAGE_ALIGNMENT;
}

export interface ImageFieldData {
    url?: string;
    alt?: string;
    title?: string;
}

export interface ImageFieldProps extends FieldProps {
    id: string;
    data?: ImageFieldData;
    options?: ImageFieldOptions;
    deleteField?: (
        fieldProps: ImageFieldProps & Required<Pick<FieldProps, 'columnIndex' | 'fieldIndex' | 'sectionIndex'>>,
    ) => void;
    modifyField?: (
        fieldProps: ImageFieldProps & Required<Pick<ImageFieldProps, 'columnIndex' | 'fieldIndex' | 'sectionIndex'>>,
    ) => void;
}

export const generateAlignmentTags = (alignment: IMAGE_ALIGNMENT, type: 'start' | 'end') => {
    if ((alignment === IMAGE_ALIGNMENT.CENTRE || alignment === IMAGE_ALIGNMENT.RIGHT) && type === 'start')
        return `<div align="${alignment}">`;
    else if ((alignment === IMAGE_ALIGNMENT.CENTRE || alignment === IMAGE_ALIGNMENT.RIGHT) && type === 'end')
        return `</div>`;
    else return '';
};

export const generateImageTag = (data: ImageFieldData, options: ImageFieldOptions) => {
    if (
        (options.alignment &&
            (options.alignment === IMAGE_ALIGNMENT.CENTRE || options.alignment === IMAGE_ALIGNMENT.RIGHT)) ||
        options.height ||
        options.width
    )
        return `<img src="${data.url}" align="${options.alignment ? options.alignment : 'left'}" height="${
            options.height
        }" width="${options.width}"/>`;
    else return `![${data.alt ? data.alt : ''}](${data.url})`;
};

export const generateImageFieldMarkdown = ({ data, options }: ImageFieldProps) => {
    if (!options)
        options = {
            height: '',
            width: '',
        };
    if (!data)
        data = {
            url: '',
            alt: '',
            title: '',
        };
    return (
        `  \n` +
        `${generateAlignmentTags(options.alignment, 'start')}` +
        `${generateImageTag(data, options)}` +
        `${generateAlignmentTags(options.alignment, 'end')}`
    );
};

export const ImageField = (
    imageFieldProps: ImageFieldProps &
        Required<Pick<ImageFieldProps, 'id' | 'sectionId' | 'sectionIndex' | 'columnIndex' | 'fieldIndex' | 'type'>>,
) => {
    const localImageFieldProps: typeof imageFieldProps = {
        options: {},
        data: {},
        ...imageFieldProps,
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === 'url')
            localImageFieldProps.modifyField({
                ...localImageFieldProps,
                data: {
                    ...localImageFieldProps.data,
                    url: value,
                },
            });
        else if (name === 'alt')
            localImageFieldProps.modifyField({
                ...localImageFieldProps,
                data: {
                    ...localImageFieldProps.data,
                    alt: value,
                },
            });
        else if (name === 'height')
            localImageFieldProps.modifyField({
                ...localImageFieldProps,
                options: {
                    ...localImageFieldProps.options,
                    height: value,
                },
            });
        else if (name === 'width')
            localImageFieldProps.modifyField({
                ...localImageFieldProps,
                options: {
                    ...localImageFieldProps.options,
                    width: value,
                },
            });
    };

    const changeAlignment = (aligment: typeof localImageFieldProps.options.alignment) => {
        const localProps = { ...localImageFieldProps };
        if (!localProps.options) localProps.options = {};
        localProps.options.alignment = aligment;
        localImageFieldProps.modifyField(localProps);
    };

    const aligmentMenu = (
        <Menu>
            <Menu.Item key="1" onClick={() => changeAlignment(IMAGE_ALIGNMENT.LEFT)}>
                Left
            </Menu.Item>
            <Menu.Item key="2" onClick={() => changeAlignment(IMAGE_ALIGNMENT.CENTRE)}>
                Centre
            </Menu.Item>
            <Menu.Item key="3" onClick={() => changeAlignment(IMAGE_ALIGNMENT.RIGHT)}>
                Right
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Row justify="space-between" style={{ marginBottom: 10 }}>
                <Col>
                    <Dropdown overlay={aligmentMenu}>
                        <Button
                            style={{ paddingLeft: 5, paddingRight: 5, width: 50 }}
                            icon={
                                <>
                                    <FontAwesomeIcon icon={faAlignLeft} /> <DownOutlined />
                                </>
                            }
                        />
                    </Dropdown>
                </Col>
                <Col>
                    <FontAwesomeIcon
                        icon={faTimes}
                        onClick={() => localImageFieldProps.deleteField(localImageFieldProps)}
                    />
                </Col>
            </Row>
            <Form layout="vertical">
                <Form.Item label="Image Alt Text">
                    <Input name="alt" value={localImageFieldProps.data.alt} onChange={onChange} />
                </Form.Item>
                <Form.Item label="Image URL">
                    <Input name="url" value={localImageFieldProps.data.url} onChange={onChange} />
                </Form.Item>
                <Form.Item label="Height">
                    <Input name="height" value={localImageFieldProps.options.height} onChange={onChange} />
                </Form.Item>
                <Form.Item label="Width">
                    <Input name="width" value={localImageFieldProps.options.width} onChange={onChange} />
                </Form.Item>
            </Form>
        </>
    );
};

export default ImageField;