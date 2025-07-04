
'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Quote, Code, Paintbrush, AlignLeft,
  AlignCenter, AlignRight, AlignJustify, Underline, Highlighter, Link as LinkIcon, Minus,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import UnderlineExt from '@tiptap/extension-underline';
import HighlightExt from '@tiptap/extension-highlight';
import LinkExt from '@tiptap/extension-link';
import { useCallback } from 'react';

const TiptapToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const fontFamilies = [
    { name: 'Inter (Défaut)', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Merriweather', value: 'Merriweather' },
  ];

  const fontSizes = ['12px', '14px', '16px', '18px', '24px', '30px'];

  return (
    <TooltipProvider delayDuration={0}>
      <div className="border-b border-input bg-transparent rounded-t-md p-1 flex items-center gap-1 flex-wrap">
        <Select
          onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}
          value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
        >
          <SelectTrigger className="w-[150px] h-9 text-xs">
            <SelectValue placeholder="Police" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map(font => (
              <SelectItem key={font.value} value={font.value}>{font.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => editor.chain().focus().setMark('textStyle', { fontSize: value }).run()}
          value={editor.getAttributes('textStyle').fontSize || '16px'}
        >
          <SelectTrigger className="w-[80px] h-9 text-xs">
            <SelectValue placeholder="Taille" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map(size => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Separator orientation="vertical" className="h-8" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
              <Bold className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Gras</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
              <Italic className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Italique</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive('underline')} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
              <Underline className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Souligné</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
              <Strikethrough className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Barré</p></TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-8" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive('highlight')} onPressedChange={() => editor.chain().focus().toggleHighlight().run()}>
              <Highlighter className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Surligner</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <input
              type="color"
              onInput={(event: React.ChangeEvent<HTMLInputElement>) => editor.chain().focus().setColor(event.target.value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="w-8 h-8 p-1 bg-transparent border-none rounded-sm cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent><p>Couleur du texte</p></TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => editor.chain().focus().unsetColor().run()} disabled={!editor.getAttributes('textStyle').color}>
                    <Paintbrush className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>Réinitialiser la couleur</p></TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive('link')} onPressedChange={setLink}>
              <LinkIcon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Ajouter/Modifier un lien</p></TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-8" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive({ textAlign: 'left' })} onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}>
              <AlignLeft className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Aligner à gauche</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive({ textAlign: 'center' })} onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}>
              <AlignCenter className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Centrer</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive({ textAlign: 'right' })} onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}>
              <AlignRight className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Aligner à droite</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive({ textAlign: 'justify' })} onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}>
              <AlignJustify className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Justifier</p></TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-8" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
              <List className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Liste à puces</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
              <ListOrdered className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Liste numérotée</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
              <Quote className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent><p>Citation</p></TooltipContent>
        </Tooltip>
         <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <Minus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Ligne horizontale</p></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

type RichTextEditorProps = {
  content: string;
  onChange: (richText: string) => void;
  placeholder?: string;
};

export const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        textStyle: false, // disable default textStyle to use our own
        fontFamily: false, // disable default fontFamily
      }),
      TextStyle,
      FontFamily,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      UnderlineExt,
      HighlightExt.configure({ multicolor: true }),
      LinkExt.configure({ openOnClick: false, autolink: true }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-full p-4 focus:outline-none min-h-[150px] rounded-b-md',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  return (
    <div className="border border-input rounded-md bg-background">
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
};
