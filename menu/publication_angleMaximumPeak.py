from tkinter import *
from tkinter import filedialog, messagebox, colorchooser
from tkinter import ttk, font
import numpy as np
import pandas as pd
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.backends.backend_tkagg import (
                                    FigureCanvasTkAgg, NavigationToolbar2Tk)
from matplotlib.figure import Figure
import matplotlib
import pickle
import math
from matplotlib.markers import MarkerStyle

def main():
    root = Tk()

    data = pd.read_csv('data.txt', header = None)
    coords = pd.read_csv('Coords_center.csv', header = None)
    x, y = coords.iloc[:,0].to_numpy()/1000, coords.iloc[:, 1].to_numpy()/1000
    c = np.array([v for v in data.iloc[:,0]])

    fig = Figure(figsize=(7.5, 6), dpi = 100)
    ax = fig.add_subplot(111)

    cax=ax.scatter(x, y, c = c, s = 140, cmap = 'jet', marker = 's')
    cbar=fig.colorbar(cax, ticks = np.linspace(min(c), max(c), num = 9))

    cbar.ax.set_title('deg')
    ax.set_title('Angle')

    app = Publication_angleMaximumPeak(root,  c, ax,fig, cbar, cax)
    app.pack(fill = 'both', expand =1)
    root.mainloop()

#######################font
class Myfont():
    def __init__(self, master, canvas, text = 'xxxx', x=100, y=50):
        self.canvas = canvas
        self.rect_item = None

    # def new_text(self, text):
        self.fontf_var = StringVar()
        self.fontf_var.set('Times New Roman')
        self.fontw_var = StringVar()
        self.fontw_var.set('normal')
        self.fonts_var = IntVar()
        self.fonts_var.set(12)
        self.fontc_var = StringVar()
        self.fontc_var.set('black')
        self.fonta_var = IntVar()
        self.fonta_var.set(0)
        self.font_var = StringVar()
        self.font_var.set('dsdsds')

        # self.font_var.set(slabel.itemcget(self.obj, 'text'))
        self.label = Label(canvas, textvariable = self.font_var, bg = 'white', font = ('Times New Roman', 12, 'normal'))
        self.obj = self.canvas.create_window(x, y, window = self.label)

        self.canvas.update()
        #movement
        self.label.bind('<B1-Motion>', self.mov)
        self.fontgui = FontGUI(master, canvas, self)


    def get_para(self):
        para = {}
        para['fontf_var'] = self.fontf_var.get()
        para['fontw_var'] = self.fontw_var.get()
        para['fonts_var'] = self.fonts_var.get()
        para['fontc_var'] = self.fontc_var.get()
        para['fonta_var'] = self.fonta_var.get()
        para['font_var'] = self.font_var.get()
        return para

    def loseFocus(self, e):
        if self.rect_item is not None:
            self.canvas.delete(self.rect_item)
        self.canvas.update()


    def drag_start(self, event):
        widget = event.widget
        widget.startX = event.x
        widget.startY = event.y

    def mov(self, event):
        # self.highlight()
        widget = event.widget
        x = widget.winfo_x() - widget.startX + event.x
        y = widget.winfo_y() - widget.startY + event.y
        widget.place(x=x,y=y)
        self.canvas.update()

    def mouse_release(self, event):
        self.highlight()

    def highlight(self, e=''):
        if self.rect_item is not None:
            self.canvas.delete(self.rect_item)
        bbox = self.canvas.bbox(self.obj)
        self.rect_item = self.canvas.create_rectangle(bbox, outline="red2", fill="")
        self.canvas.tag_raise(self.obj,self.rect_item)
        self.canvas.update()



class ToolTip(object):

    def __init__(self, widget):
        self.widget = widget
        self.tipwindow = None
        self.id = None
        self.x = self.y = 0

    def showtip(self, text):
        "Display text in tooltip window"
        self.text = text
        if self.tipwindow or not self.text:
            return
        x, y, cx, cy = self.widget.bbox("insert")
        x = x + self.widget.winfo_rootx() + 30
        y = y + self.widget.winfo_rooty() -30
        self.tipwindow = tw = Toplevel(self.widget)
        tw.wm_overrideredirect(1)
        tw.wm_geometry("+%d+%d" % (x, y))
        label = Label(tw, text=self.text, justify=LEFT,
                      background="#ffffe0", relief=SOLID, borderwidth=1,
                      font=("tahoma", "8", "normal"))
        label.pack(ipadx=1)

    def hidetip(self):
        tw = self.tipwindow
        self.tipwindow = None
        if tw:
            tw.destroy()

def CreateToolTip(widget, text):
    toolTip = ToolTip(widget)
    def enter(event):
        toolTip.showtip(text)
    def leave(event):
        toolTip.hidetip()
    widget.bind('<Enter>', enter)
    widget.bind('<Leave>', leave)

class FontGUI(Frame):
    def __init__(self, master, canvas, myfont):
        super().__init__(master)
        self.canvas = canvas
        self.obj = myfont.obj
        self.label = myfont.label
        self.myfont = myfont


        #mainGUI
        tool_f = LabelFrame(self, text = 'set font')
        tool_f.pack()
        #fontfamily
        self.fontf_var = StringVar()
        self.fontf_var.set('Times New Roman')
        fontf = ttk.Combobox(tool_f , textvariable = self.fontf_var, values = font.families(), state = 'readonly')
        fontf.bind('<<ComboboxSelected>>', self.on_font)
        #fontweight
        self.fontw_var = StringVar()
        self.fontw_var.set('normal')
        fontw = ttk.Combobox(tool_f , width = 7, textvariable = self.fontw_var, values = ['normal', 'bold', 'italic'], state = 'readonly')
        fontw.bind('<<ComboboxSelected>>', self.on_font)
        #fontsize
        self.fonts_var = IntVar()
        self.fonts_var.set(12)
        fonts = Scale(tool_f, from_ = 5, to=100, resolution = 1,  width = 8,orient = 'horizontal', variable = self.fonts_var, command = self.on_font)
        #fontcolor
        self.fontc_var = StringVar()
        self.fontc_var.set('black')
        self.fontc = Button(tool_f, text = '     ', relief = 'flat', bg = self.fontc_var.get(), command = self.on_font_color)
        #fontangle
        self.fonta_var = IntVar()
        self.fonta_var.set(0)
        fonta = Scale(tool_f, from_ = 0, to=360, resolution = 1, width = 8, orient = 'horizontal', variable = self.fonta_var, command = self.on_font)
        #font content
        self.font_var = StringVar()
        # self.font_var.set(self.canvas.itemcget(self.obj, 'text'))
        font_e = Entry(tool_f,width = 50, textvariable = self.font_var, relief = 'flat')
        font_e.bind('<FocusOut>',  self.on_update_text)
        font_e.bind('<Return>',   self.on_update_text)

        fontf.grid(row =0,column=0, padx = (5,5), pady = (5,5))
        fontw.grid(row =0,column=1, padx = (5,5), pady = (5,5))
        fonts.grid(row =0,column=2, padx = (5,5), pady = (5,5))
        self.fontc.grid(row =0,column=3, padx = (5,5), pady = (5,5))
        fonta.grid(row =0,column=4, padx = (5,5), pady = (5,5))
        font_e.grid(row =0,column=5, columnspan = 5, padx = (5,5), pady = (5,5))

        CreateToolTip(fontf, 'pick a new font for the text')
        CreateToolTip(fontw, 'bold or italic')
        CreateToolTip(fonts, 'font size')
        CreateToolTip(self.fontc, 'font color')
        CreateToolTip(fonta, 'rotete the text')

        para = myfont.get_para()
        self.set_para(para)


    def on_update_text(self, e):
        text = self.font_var.get()
        self.myfont.font_var.set(text)
        self.canvas.update()



    def on_font_color(self):
        color_code = colorchooser.askcolor(title ="Choose color")[1]
        self.fontc_var.set(color_code)
        self.fontc.config(bg = self.fontc_var.get())
        self.on_font()

    def on_font(self, e=''):
        self.set_font(deg= self.fonta_var.get(), fontsize = self.fonts_var.get(), fontcolor = self.fontc_var.get(), fontfamily = self.fontf_var.get(), fontweight = self.fontw_var.get())

    def set_font(self, deg, fontsize, fontcolor, fontfamily, fontweight):
        self.label.config( font = (fontfamily, fontsize, fontweight))
        # self.canvas.itemconfigure(self.obj, angle = deg)
        self.label.config( fg = fontcolor)

    def set_para(self, para):
        self.fontf_var.set(para['fontf_var'])
        self.fontw_var.set(para['fontw_var'])
        self.fonts_var.set(para['fonts_var'])
        self.fontc_var.set(para['fontc_var'])
        self.fonta_var.set(para['fonta_var'])
        self.font_var.set(para['font_var'])


class FontPanel(Frame):
    def __init__(self, master,canvas):
        super().__init__(master)
        self.canvas = canvas

        self.myfonts = []
        self.num = 0
        self.canvas.bind("<Button-1>", self.on_canvas)

    def on_canvas(self, e):
        for font in self.myfonts:
            font.fontgui.pack_forget()
            font.label.config(relief = 'flat')



    def on_add(self):
        font = Myfont(self, self.canvas, x= 500+self.num*20, y = 20+self.num*10)
        self.myfonts.append(font)
        self.num+=1

        font.label.bind("<Button-1>", lambda e, obj = font:self.on_click(e, obj))
        return font

    def on_click(self,event, obj):
        for font in self.myfonts:
            font.fontgui.pack_forget()
            font.label.config(relief = 'flat')

        obj.label.config(relief = 'solid')
        obj.fontgui.pack(side = 'bottom')
        obj.drag_start(event)
###############font



#main
class Publication_angleMaximumPeak(Frame):
    def __init__(self, master,  c, ax, fig, cbar, cax):
        super().__init__(master)

        self.canvas = Publication_canvas_thickness(self,  c, ax, fig, cbar, cax)#left
        para_p =Frame(self)#right

        self.canvas.pack(side = 'left', fill = 'both', expand = True)
        para_p.pack(side = 'right', anchor = 'nw')

        self.para = Publication_para_thickness(para_p,  self.canvas)
        exp_p = LabelFrame(para_p, text = 'All sparameters', fg = 'red') #export button panel
        Button(exp_p, text = 'export .csv', command = self.on_export_csv).grid(row = 0, column =1, sticky = 'nw', padx = (5,5))
        Button(exp_p, text = 'save as template', command = self.on_save_template).grid(row = 0, column =2, sticky = 'nw', padx = (5,5))
        Button(exp_p, text = 'import template', command = self.on_import_template).grid(row = 0, column =3
            , sticky = 'nw', padx = (5,5))
        fontpanel = FontPanel(master, self.canvas.canvas.get_tk_widget())
        fontpanel.pack(side = 'bottom')


        self.para.grid(row = 0, column =0, sticky = 'nw', padx = (5,5))
        exp_p.grid(row = 1, column =0, sticky = 'nw', padx = (5,5))
        Button(para_p, text = 'add font',fg = 'green', command = fontpanel.on_add).grid(row = 2, column =0, sticky = 'nw', padx = (10,5),pady = (5,5))

    def on_export_csv(self):
        path = filedialog.asksaveasfilename(title='Select path')
        if not path:
            return
        df = pd.DataFrame(self.c, columns = ['data'])

        df.to_csv(path+'.csv', sep = ';')
        messagebox.showinfo(message = 'data exported!')

    def on_save_template(self):
        path = filedialog.asksaveasfilename(title='Select path')
        if not path:
            return

        pickle.dump(self.para.get_all_paras(), open( path+'.anglePeakXRD_template', "wb" ) )
        messagebox.showinfo(message = 'anglePeakXRD template saved!')

    def on_import_template(self):
        path = filedialog.askopenfilename(title = 'Select file',filetypes = (("anglePeakXRD template file","*.anglePeakXRD_template"),("all files","*.*")))
        if not path:
            return
        self.para.set_all_paras(pickle.load(open( path, "rb" )))



#canvas
class Publication_canvas_thickness(Frame):
    def __init__(self, master,  c, ax,fig, cbar, cax):
        super().__init__(master)

        canvas=FigureCanvasTkAgg(fig, master=self)
        toolbar = NavigationToolbar2Tk(canvas, self)
        toolbar.update()
        canvas.get_tk_widget().pack()

        self.c = c
        self.ax = ax
        self.canvas = canvas
        self.cbar = cbar
        self.cax = cax


 #set colorbar num
    def set_colorbar_ticknum(self, ticknum, decimalnum):
        cb, ele, canvas = self.cbar, 'Angle', self.canvas
        c = self.c
        if decimalnum != 0:
            # cb.set_ticklabels()
            cb.set_ticks(np.linspace(c.min(), c.max(), ticknum, endpoint = True), decimalnum)
            cb.set_ticklabels( np.round(np.linspace(c.min(), c.max(), ticknum, endpoint = True), decimalnum))
        else:
            cb.set_ticks(np.linspace(c.min(), c.max(), ticknum, endpoint = True))
            cb.set_ticklabels([int(i) for i in np.linspace(c.min(), c.max(), ticknum, endpoint = True)])
        canvas.draw()

    #set figure title
    def set_fig_title(self, figTitle, fontsize, color, fontstyle, fontweight):

        self.ax.set_title(figTitle[0], fontsize = fontsize, color =color, fontstyle = fontstyle, fontweight = fontweight)
        self.canvas.draw()

    #set colorbar title
    def set_colorbar_title(self, figTitle, fontsize, color, fontstyle, fontweight):
        self.cbar.ax.set_title(figTitle[0], fontsize = fontsize, color =color, fontstyle = fontstyle, fontweight = fontweight)
        self.canvas.draw()

    #set colorbar ticks
    def set_colorbar_ticks(self, fontsize, color, fontstyle, fontweight):
        cb,canvas =self.cbar, self.canvas
        for t in cb.ax.get_yticklabels():
            t.set_fontsize(fontsize)
            t.set_color(color)
            t.set_fontstyle(fontstyle)
            t.set_fontweight(fontweight)
        canvas.draw()

    #set figure scatter
    def set_fig_scatter(self,marker , markersize,  cmap, alpha, linewidth, edgecolors):
        self.cax.set_paths([MarkerStyle(marker).get_path().transformed(MarkerStyle(marker).get_transform()) for i in self.c])
        self.cax.set_sizes([markersize for i in self.c])
        self.cax.set_alpha(alpha)
        self.cax.set_cmap(cmap)
        self.cax.set_linewidth(linewidth)
        self.cax.set_edgecolors(edgecolors)
        self.canvas.draw()

    #set axis ticks
    def set_fig_ticks(self, axistype):
        self.ax.axis('on')
        if axistype == 'normal':
            self.ax.xaxis.set_visible(True)
            self.ax.yaxis.set_visible(True)
        elif axistype == 'without axis':
            self.ax.xaxis.set_visible(False)
            self.ax.yaxis.set_visible(False)
        elif axistype == 'without X-axis':
            self.ax.xaxis.set_visible(False)
            self.ax.yaxis.set_visible(True)
        elif axistype == 'without Y-axis':
            self.ax.xaxis.set_visible(True)
            self.ax.yaxis.set_visible(False)
        elif axistype == 'without frame':
            self.ax.axis('off')

        self.canvas.draw()

    #set axis tick color
    def set_fig_tick_color(self, color):
        ax, canvas = self.ax, self.canvas
        ax.tick_params(color=color, labelcolor=color)
        for spine in ax.spines.values():
            spine.set_edgecolor(color)
        canvas.draw()
    #set axis fontsize
    def set_fig_axis_fontsize(self, fontsize):
        ax, canvas = self.ax, self.canvas
        for item in ([ ax.xaxis.label, ax.yaxis.label] +
            ax.get_xticklabels() + ax.get_yticklabels()):
            item.set_fontsize(fontsize)
        canvas.draw()
    #set axis font
    def set_axis_font(self, weight):
        ax, canvas = self.ax, self.canvas
        labels = ax.get_xticklabels() + ax.get_yticklabels()
        for label in labels:
            label.set_fontweight(weight)
        canvas.draw()

class Publication_para_thickness(Frame):
    def __init__(self, master, canvas):
        super().__init__(master)
        self.canvas = canvas

        #1.fig title
        f_figTitle = LabelFrame(self, text = 'Figure title', fg = 'blue')
        self.figTitle_cb = ttk.Combobox(f_figTitle, values = ['Angle',  'without title'], width = 20)
        self.figTitle_cb.current(0)
        self.figTitle_cb.bind('<<ComboboxSelected>>', self.on_set_title)
        #fontsize
        self.figTitleFont = IntVar()
        self.figTitleFont.set(12)
        self.figTitle_font = Spinbox(f_figTitle, from_ = 1, to = 30, increment = 1, textvariable = self.figTitleFont, width = 4, wrap = False, command = lambda event = '': self.on_set_title(event), state = 'readonly')
        #fontcolor
        self.figTitleColor = StringVar()
        self.figTitleColor.set('black')
        self.figTitleColor_l = Label(f_figTitle, text = '      ', bg = 'black')
        self.figTitleColor_l.bind('<Button-1>', self.on_figTitleColor)
        #fontstyle
        self.figTitleFontStyle = ttk.Combobox(f_figTitle, values = ['normal', 'italic'], width = 8)
        self.figTitleFontStyle.current(0)
        self.figTitleFontStyle.bind('<<ComboboxSelected>>', self.on_set_title)
        #fontweight
        self.figTitleFontWeight = ttk.Combobox(f_figTitle, values = ['normal', 'ultralight', 'light',  'medium', 'roman', 'semibold', 'demibold', 'demi', 'bold'], width = 8)
        self.figTitleFontWeight.current(0)
        self.figTitleFontWeight.bind('<<ComboboxSelected>>', self.on_set_title)
        # title decimal
        self.figTitleDecimal = IntVar()
        self.figTitleDecimal.set(1)
        self.figTitle_decimal = Spinbox(f_figTitle, from_ = 0, to = 1, increment = 1, textvariable = self.figTitleDecimal, width = 4, wrap = False, command = lambda event = '': self.on_set_title(event), state = 'readonly')

        Label(f_figTitle, text = 'title type:').grid(row = 0, column = 0, padx = (5,0), sticky = 'w')
        self.figTitle_cb.grid(row = 0, column = 1, padx = (5,5), sticky = 'w')
        Label(f_figTitle, text = 'font size:').grid(row = 0, column = 2, padx = (5,0), sticky = 'w')
        self.figTitle_font.grid(row = 0, column = 3, padx = (5,5), sticky = 'w')
        Label(f_figTitle, text = 'font color:').grid(row = 1, column = 0, padx = (5,0), pady=(5,5), sticky = 'w')
        self.figTitleColor_l.grid(row = 1, column = 1, padx = (5,5), pady=(5,5), sticky = 'w')
        Label(f_figTitle, text = 'font style:').grid(row = 1, column = 2, padx = (5,0), sticky = 'w')
        self.figTitleFontStyle.grid(row = 1, column = 3, padx = (5,5),pady = (5,5), sticky = 'w')
        Label(f_figTitle, text = 'font weight:').grid(row = 2, column = 0, padx = (5,0), sticky = 'w')
        self.figTitleFontWeight.grid(row = 2, column = 1, padx = (5,5), sticky = 'w')
        Label(f_figTitle, text = 'decimal place:').grid(row = 2, column = 2, padx = (5,5), sticky = 'w')
        self.figTitle_decimal.grid(row = 2, column = 3, padx = (5,5), pady = (5,5),sticky = 'w')

        #2. scatter types
        f_scatter = LabelFrame(self, text = 'Scatter plot configuration', fg= 'blue')
        #scattermarker
        self.scatterMarker_cb = ttk.Combobox(f_scatter, values = ['s', 'o', '.', 'v', '^', '*', 'P','D', 'X'], width = 5)
        self.scatterMarker_cb.current(1)
        self.scatterMarker_cb.bind('<<ComboboxSelected>>', self.on_set_scatter)
        #markersize
        self.scatterMarker_size = IntVar()
        self.scatterMarker_size.set(168)
        self.scatterMarkerSize = Scale(f_scatter, from_=1, to=400, orient = 'horizontal', variable= self.scatterMarker_size, width = 10, command = lambda e = '':self.on_set_scatter(e))

        #cmap
        self.scatter_cmap_cb = ttk.Combobox(f_scatter, values = ['jet', 'ocean_r', 'gist_earth_r', 'terrain_r', 'gist_stern_r',
            'gnuplot_r', 'gnuplot2_r', 'CMRmap_r', 'cubehelix_r', 'brg',
            'gist_rainbow', 'rainbow',  'turbo_r',  'Greys', 'Purples', 'Blues', 'Greens', 'Oranges', 'Reds','binary', 'gist_yarg', 'gist_gray', 'gray_r', 'bone_r', 'pink_r',
            'spring', 'summer', 'autumn', 'winter', 'cool','Pastel1', 'Pastel2', 'Paired', 'Accent',
                        'Dark2', 'Set1', 'Set2', 'Set3',
                        'tab10', 'tab20', 'tab20b', 'tab20c','flag', 'prism', 'ocean', 'gist_earth', 'terrain', 'gist_stern', 'nipy_spectral_r', 'gist_ncar_r'], width = 10)
        self.scatter_cmap_cb.current(0)
        self.scatter_cmap_cb.bind('<<ComboboxSelected>>', self.on_set_scatter)

        #scatterlinewidth
        self.scatterLinewidth = DoubleVar()
        self.scatterLinewidth.set(0.0)
        self.scatterLinewidth_sp = Scale(f_scatter, from_=0, to=5, resolution = 0.1,orient = 'horizontal', variable= self.scatterLinewidth, width = 10, command = lambda e = '':self.on_set_scatter(e))

        #scatterEdgeColor
        self.scatterEdgeColor = StringVar()
        self.scatterEdgeColor.set('black')
        self.scatterEdgeColor_l = Label(f_scatter, text = '      ', bg = 'black')
        self.scatterEdgeColor_l.bind('<Button-1>', self.on_scatterEdgeColor)
        #scatteralpha
        self.scatteralpha = DoubleVar()
        self.scatteralpha.set(1.0)
        self.scatteralpha_sp = Scale(f_scatter, from_=0, to=1, resolution = 0.1,orient = 'horizontal', variable= self.scatteralpha, width = 10, command = lambda e = '':self.on_set_scatter(e))


        Label(f_scatter, text = 'scatter type:').grid(row = 0, column = 0, padx = (5,0), sticky = 'w')
        self.scatterMarker_cb.grid(row = 0, column = 1, padx = (5,5), sticky = 'w')
        Label(f_scatter, text = 'marker size:').grid(row = 0, column = 2, padx = (5,0), sticky = 'w')
        self.scatterMarkerSize.grid(row = 0, column = 3, padx = (5,5), sticky = 'w')
        Label(f_scatter, text = 'colormap:').grid(row = 1, column = 0, padx = (5,0), sticky = 'w')
        self.scatter_cmap_cb.grid(row = 1, column = 1, padx = (5,5), sticky = 'w')
        Label(f_scatter, text = 'marker edge color:').grid(row = 1, column = 2, padx = (5,0), sticky = 'w')
        self.scatterEdgeColor_l.grid(row = 1, column = 3, padx = (5,5), pady = (5,5), sticky = 'w')
        Label(f_scatter, text = 'marker edge width:').grid(row = 2, column = 0, padx = (5,0), sticky = 'w')
        self.scatterLinewidth_sp.grid(row = 2, column = 1, padx = (5,5), sticky = 'w')
        Label(f_scatter, text = 'transparent:').grid(row = 2, column = 2, padx = (5,0), sticky = 'w')
        self.scatteralpha_sp.grid(row = 2, column = 3, padx = (5,5), sticky = 'w')

        #axis configuration
        f_figaxis = LabelFrame(self, text = 'Axis configuration', fg = 'blue')
        self.figAxisTickLabels = ttk.Combobox(f_figaxis, values = ['normal', 'without X-axis', 'without Y-axis', 'without axis', 'without frame'], width = 18)
        self.figAxisTickLabels.current(0)
        self.figAxisTickLabels.bind('<<ComboboxSelected>>', self.on_set_axis)
        #tickcolor
        self.figAxisTickColor = StringVar()
        self.figAxisTickColor.set('black')
        self.figAxisTickColor_l = Label(f_figaxis, text = '      ', bg = 'black')
        self.figAxisTickColor_l.bind('<Button-1>', self.on_set_tick_color)
        #fontsize
        self.figAxisFontSize = IntVar()
        self.figAxisFontSize.set(10)
        self.figAxisFontSize_sb = Spinbox(f_figaxis, from_ = 1, to = 30, increment = 1, textvariable = self.figAxisFontSize, width = 4, wrap = False, command = self.on_set_axis_fontsize, state = 'readonly')
        #fontweight
        self.FigAxisFontWeight = ttk.Combobox(f_figaxis, values = ['normal', 'ultralight', 'light',  'medium', 'roman', 'semibold', 'demibold', 'demi', 'bold'], width = 8)
        self.FigAxisFontWeight.current(0)
        self.FigAxisFontWeight.bind('<<ComboboxSelected>>', self.on_set_axis_font)

        Label(f_figaxis, text = 'tick label:').grid(row = 0, column = 0, padx = (5,0), sticky = 'w')
        self.figAxisTickLabels.grid(row = 0, column = 1, padx = (5,5), sticky = 'w')
        Label(f_figaxis, text = 'tick color:').grid(row = 0, column = 2, padx = (5,0), sticky = 'w')
        self.figAxisTickColor_l.grid(row = 0, column = 3, padx = (5,5),pady = (5,5), sticky = 'w')
        Label(f_figaxis, text = 'tick font size:').grid(row = 1, column = 0, padx = (5,0), sticky = 'w')
        self.figAxisFontSize_sb.grid(row = 1, column = 1, padx = (5,5),pady = (5,5), sticky = 'w')
        Label(f_figaxis, text = 'tick font weight:').grid(row = 1, column = 2, padx = (5,0), sticky = 'w')
        self.FigAxisFontWeight.grid(row = 1, column = 3, padx = (5,5), sticky = 'w')

        #colorbar title
        f_colorbar_title = LabelFrame(self, text = 'Colorbar title', fg = 'blue')
        self.colorbarTitle_cb = ttk.Combobox(f_colorbar_title, values = ['deg',  'without title'], width = 16)
        self.colorbarTitle_cb.current(1)
        self.colorbarTitle_cb.bind('<<ComboboxSelected>>', self.on_set_colorbar_title)
        #colorbar fontsize
        self.colorbarTitleFont = IntVar()
        self.colorbarTitleFont.set(12)
        self.colorbarTitle_font = Spinbox(f_colorbar_title, from_ = 1, to = 30, increment = 1, textvariable = self.colorbarTitleFont, width = 4, wrap = False, command = lambda event = '': self.on_set_colorbar_title(event), state = 'readonly')
        #colorbar fontcolor
        self.colorbarTitleColor = StringVar()
        self.colorbarTitleColor.set('black')
        self.colorbarTitleColor_l = Label(f_colorbar_title, text = '      ', bg = 'black')
        self.colorbarTitleColor_l.bind('<Button-1>', self.on_colorbarTitleColor)
        #colorbar fontstyle
        self.colorbarTitleFontStyle = ttk.Combobox(f_colorbar_title, values = ['normal', 'italic'], width = 8)
        self.colorbarTitleFontStyle.current(0)
        self.colorbarTitleFontStyle.bind('<<ComboboxSelected>>', self.on_set_colorbar_title)
        #colorbar fontweight
        self.colorbarTitleFontWeight = ttk.Combobox(f_colorbar_title, values = ['normal', 'ultralight', 'light',  'medium', 'roman', 'semibold', 'demibold', 'demi', 'bold'], width = 8)
        self.colorbarTitleFontWeight.current(0)
        self.colorbarTitleFontWeight.bind('<<ComboboxSelected>>', self.on_set_colorbar_title)
        # colorbar title decimal
        self.colorbarTitleDecimal = IntVar()
        self.colorbarTitleDecimal.set(1)
        self.colorbarTitleDecimal_sb = Spinbox(f_colorbar_title, from_ = 0, to = 2, increment = 1, textvariable = self.colorbarTitleDecimal, width = 4, wrap = False, command = lambda event = '': self.on_set_colorbar_title(event), state = 'readonly')

        Label(f_colorbar_title, text = 'title type:').grid(row = 0, column = 0, padx = (5,0), sticky = 'w')
        self.colorbarTitle_cb.grid(row = 0, column = 1, padx = (5,5), sticky = 'w')
        Label(f_colorbar_title, text = 'title font size:').grid(row = 0, column = 2, padx = (5,0), sticky = 'w')
        self.colorbarTitle_font.grid(row = 0, column = 3, padx = (5,5), sticky = 'w')
        Label(f_colorbar_title, text = 'title color:').grid(row = 1, column = 0, padx = (5,0), sticky = 'w')
        self.colorbarTitleColor_l.grid(row = 1, column = 1, padx = (5,5), pady=(5,5), sticky = 'w')
        Label(f_colorbar_title, text = 'title font style:').grid(row = 1, column = 2, padx = (5,0), sticky = 'w')
        self.colorbarTitleFontStyle.grid(row = 1, column = 3, padx = (5,5), sticky = 'w')
        Label(f_colorbar_title, text = 'title font weight:').grid(row = 2, column = 0, padx = (5,0), sticky = 'w')
        self.colorbarTitleFontWeight.grid(row = 2, column = 1, padx = (5,5), sticky = 'w')
        Label(f_colorbar_title, text = 'title decimal place:').grid(row = 2, column = 2, padx = (5,0), sticky = 'w')
        self.colorbarTitleDecimal_sb.grid(row = 2, column = 3, padx = (5,5), sticky = 'w')


        #colorbar ticks
        f_colorbar_ticks = LabelFrame(self, text = 'Colorbar ticks', fg = 'blue')

        #colorbar fontsize
        self.colorbarTicksFont = IntVar()
        self.colorbarTicksFont.set(10)
        self.colorbarTicks_font = Spinbox(f_colorbar_ticks, from_ = 1, to = 30, increment = 1, textvariable = self.colorbarTicksFont, width = 4, wrap = False, command = lambda event = '': self.on_set_colorbar_ticks(event), state = 'readonly')
        #colorbar fontcolor
        self.colorbarTicksColor = StringVar()
        self.colorbarTicksColor.set('black')
        self.colorbarTicksColor_l = Label(f_colorbar_ticks, text = '      ', bg = 'black')
        self.colorbarTicksColor_l.bind('<Button-1>', self.on_colorbarTicksColor)
        #colorbar fontstyle
        self.colorbarTicksFontStyle = ttk.Combobox(f_colorbar_ticks, values = ['normal', 'italic'], width = 8)
        self.colorbarTicksFontStyle.current(0)
        self.colorbarTicksFontStyle.bind('<<ComboboxSelected>>', self.on_set_colorbar_ticks)
        #colorbar fontweight
        self.colorbarTicksFontWeight = ttk.Combobox(f_colorbar_ticks, values = ['normal', 'ultralight', 'light',  'medium', 'roman', 'semibold', 'demibold', 'demi', 'bold'], width = 8)
        self.colorbarTicksFontWeight.current(0)
        self.colorbarTicksFontWeight.bind('<<ComboboxSelected>>', self.on_set_colorbar_ticks)

        #ticknum
        self.colorbar_ticknum = IntVar()
        self.colorbar_ticknum.set(8)
        self.colorbar_ticknum_sb = Spinbox(f_colorbar_ticks, from_ = 0, to = 30, increment = 1, textvariable = self.colorbar_ticknum, width = 4, wrap = False, command = self.on_set_colorbar_ticknum, state = 'readonly')
        #tickdecimal
        self.colorbar_tickdecimal = IntVar()
        self.colorbar_tickdecimal.set(1)
        self.colorbar_tickdecimal_sb = Spinbox(f_colorbar_ticks, from_ = 0, to = 2, increment = 1, textvariable = self.colorbar_tickdecimal, width = 4, wrap = False, command = self.on_set_colorbar_ticknum, state = 'readonly')

        Label(f_colorbar_ticks, text = 'number of ticks:').grid(row = 0, column = 0, padx = (5,0), pady = (5,5), sticky = 'w')
        self.colorbar_ticknum_sb.grid(row = 0, column = 1, padx = (5,5), sticky = 'w')
        Label(f_colorbar_ticks, text = 'tick decimal place:').grid(row = 0, column = 2, padx = (5,0), sticky = 'w')
        self.colorbar_tickdecimal_sb.grid(row = 0, column = 3, padx = (5,5), sticky = 'w')
        Label(f_colorbar_ticks, text = 'tick font size:').grid(row = 1, column = 0, padx = (5,0), sticky = 'w')
        self.colorbarTicks_font.grid(row = 1, column = 1, padx = (5,5), sticky = 'w')
        Label(f_colorbar_ticks, text = 'tick color:').grid(row = 1, column = 2, padx = (5,0), sticky = 'w')
        self.colorbarTicksColor_l.grid(row = 1, column = 3, padx = (5,5), pady=(5,5), sticky = 'w')
        Label(f_colorbar_ticks, text = 'tick font type:').grid(row = 2, column = 0, padx = (5,0), sticky = 'w')
        self.colorbarTicksFontStyle.grid(row = 2, column = 1, padx = (5,5), sticky = 'w')
        Label(f_colorbar_ticks, text = 'tick font weidht:').grid(row =2, column = 2, padx = (5,0), sticky = 'w')
        self.colorbarTicksFontWeight.grid(row = 2, column = 3, padx = (5,5),pady = (5,5), sticky = 'w')





        f_figTitle.pack(anchor = 'nw', pady = (10,10))
        f_scatter.pack(anchor = 'nw', pady = (10,10))
        f_figaxis.pack(anchor = 'nw', pady = (10,10))
        f_colorbar_title.pack(anchor = 'nw', pady = (10,10))
        f_colorbar_ticks.pack(anchor = 'nw', pady = (10,10))



    #colorbar ticknum
    def on_set_colorbar_ticknum(self):
        self.canvas.set_colorbar_ticknum(self.colorbar_ticknum.get(), self.colorbar_tickdecimal.get())


    #colorbar ticks
    def on_colorbarTicksColor(self, event):
        self.colorbarTicksColor.set(colorchooser.askcolor(title ="Choose color")[1])
        self.colorbarTicksColor_l.config(bg = self.colorbarTicksColor.get())
        self.on_set_colorbar_ticks('')


    def on_set_colorbar_ticks(self, event):
        self.canvas.set_colorbar_ticks(fontsize = self.colorbarTicksFont.get(), color = self.colorbarTicksColor.get(), fontstyle= self.colorbarTicksFontStyle.get(), fontweight =self.colorbarTicksFontWeight.get() )


    # colorbar title color
    def on_colorbarTitleColor(self, event):
        self.colorbarTitleColor.set(colorchooser.askcolor(title ="Choose color")[1])
        self.colorbarTitleColor_l.config(bg = self.colorbarTitleColor.get())
        self.on_set_colorbar_title('')

    def get_colorbar_title(self, decimal):
        s = self.colorbarTitle_cb.get()
        eles = ['deg']
        data = self.canvas.c
        colorbarTitle = []

        if s == 'deg':
            colorbarTitle = ['deg' for i in eles]
        elif s == 'value range':

            colorbarTitle = [f'{int(np.round(data.min(), decimal))}-{int(np.round(data.max(), decimal))}' for ele in eles] if decimal ==0 else [f'{np.round(data.min(), decimal)}-{np.round(data.max(), decimal)}' for ele in eles]
        elif s == 'Angle + range':
            colorbarTitle = [f'{ele} ({int(np.round(data.min(), decimal))}-{int(np.round(data.max(), decimal))})' for ele in eles] if decimal ==0 else [f'{ele} ({np.round(data.min(), decimal)}-{np.round(data.max(), decimal)})' for ele in eles]
        elif s == 'without title':
            colorbarTitle = ['' for ele in eles]
        return colorbarTitle

    def on_set_colorbar_title(self, event):
        self.canvas.set_colorbar_title(self.get_colorbar_title(decimal = self.colorbarTitleDecimal.get()), self.colorbarTitleFont.get(), color = self.colorbarTitleColor.get(), fontstyle= self.colorbarTitleFontStyle.get(), fontweight =self.colorbarTitleFontWeight.get() )

    #set axis
    def on_set_axis(self, event):
        self.canvas.set_fig_ticks(self.figAxisTickLabels.get())

    def on_set_tick_color(self, event):
        self.figAxisTickColor.set(colorchooser.askcolor(title ="Choose color")[1])
        self.figAxisTickColor_l.config(bg = self.figAxisTickColor.get())
        self.canvas.set_fig_tick_color(self.figAxisTickColor.get())
    #axis tick fontsize
    def on_set_axis_fontsize(self):
        self.canvas.set_fig_axis_fontsize(self.figAxisFontSize.get())
    #axis tick font
    def on_set_axis_font(self, event):
        self.canvas.set_axis_font(weight = self.FigAxisFontWeight.get())



    #scattermarker
    def on_set_scatter(self, event):
        self.canvas.set_fig_scatter(marker = self.scatterMarker_cb.get(),markersize= self.scatterMarker_size.get(), cmap = self.scatter_cmap_cb.get(), edgecolors = self.scatterEdgeColor.get(), linewidth = self.scatterLinewidth.get(), alpha = self.scatteralpha.get())
    #scatterFacecolor
    def on_scatterFaceColor(self, event):
        self.scatterFaceColor.set(colorchooser.askcolor(title ="Choose color")[1])
        self.scatterFaceColor_l.config(bg = self.scatterFaceColor.get())
        self.on_set_scatter('')
    #scatterEdgecolor
    def on_scatterEdgeColor(self, event):
        self.scatterEdgeColor.set(colorchooser.askcolor(title ="Choose color")[1])
        self.scatterEdgeColor_l.config(bg = self.scatterEdgeColor.get())
        self.on_set_scatter('')



    #title font color
    def on_figTitleColor(self, event):
        self.figTitleColor.set(colorchooser.askcolor(title ="Choose color")[1])
        self.figTitleColor_l.config(bg = self.figTitleColor.get())
        self.on_set_title('')



    def get_figure_title(self, decimal):
        s = self.figTitle_cb.get()
        eles = ['Angle']
        data = self.canvas.c
        figTitle = []

        if s == 'Angle':
            figTitle = eles
        elif s == 'value range':
            figTitle = [f'{int(np.round(data.min(), decimal))}-{int(np.round(data.max(), decimal))}' for ele in eles] if decimal ==0 else [f'{np.round(data.min(), decimal)}-{np.round(data.max(), decimal)}' for ele in eles]
        elif s == 'Angle + range':
            figTitle = [f'{ele} ({int(np.round(data.min(), decimal))}-{int(np.round(data.max(), decimal))})' for ele in eles] if decimal ==0 else [f'{ele} ({np.round(data.min(), decimal)}-{np.round(data.max(), decimal)})' for ele in eles]
        elif s == 'Angle + high value':
            figTitle = [f'{ele} {int(np.round(data.max(), decimal))}' for ele in eles] if decimal == 0 else [f'{ele} {np.round(data.max(), decimal)}' for ele in eles]
        elif s == 'without title':
            figTitle = ['' for ele in eles]
        return figTitle

    def on_set_title(self, event):
        self.canvas.set_fig_title(self.get_figure_title(decimal = self.figTitleDecimal.get()), self.figTitleFont.get(), color = self.figTitleColor.get(), fontstyle= self.figTitleFontStyle.get(), fontweight =self.figTitleFontWeight.get() )

    def get_all_paras(self):
        para = {}
        para['figTitle_cb'] = self.figTitle_cb.current()
        para['figTitleFont'] = self.figTitleFont.get()
        para['figTitleColor'] = self.figTitleColor.get()
        para['figTitleFontStyle'] = self.figTitleFontStyle.current()
        para['figTitleFontWeight'] = self.figTitleFontWeight.current()
        para['figTitleDecimal'] = self.figTitleDecimal.get()
        para['self.scatterMarker_cb'] = self.scatterMarker_cb.current()
        para['self.scatterMarker_size'] = self.scatterMarker_size.get()
        para['self.scatter_cmap_cb'] = self.scatter_cmap_cb.current()
        para['self.scatterLinewidth'] = self.scatterLinewidth.get()
        para['self.scatterEdgeColor'] = self.scatterEdgeColor.get()
        para['self.scatteralpha'] = self.scatteralpha.get()
        para['self.figAxisTickLabels'] = self.figAxisTickLabels.current()
        para['self.figAxisTickColor'] = self.figAxisTickColor.get()
        para['self.figAxisFontSize'] = self.figAxisFontSize.get()
        para['self.FigAxisFontWeight'] = self.FigAxisFontWeight.current()
        para['self.colorbarTitle_cb'] = self.colorbarTitle_cb.current()
        para['self.colorbarTitleFont'] = self.colorbarTitleFont.get()
        para['self.colorbarTitleColor'] = self.colorbarTitleColor.get()
        para['self.colorbarTitleFontStyle'] = self.colorbarTitleFontStyle.current()
        para['self.colorbarTitleFontWeight'] = self.colorbarTitleFontWeight.current()
        para['self.colorbarTitleDecimal'] = self.colorbarTitleDecimal.get()
        para['self.colorbarTicksFont'] = self.colorbarTicksFont.get()
        para['self.colorbarTicksColor'] = self.colorbarTicksColor.get()
        para['self.colorbarTicksFontStyle'] = self.colorbarTicksFontStyle.current()
        para['self.colorbarTicksFontWeight'] = self.colorbarTicksFontWeight.current()
        para['self.colorbar_ticknum'] = self.colorbar_ticknum.get()
        para['self.colorbar_tickdecimal'] = self.colorbar_tickdecimal.get()
        return para



    def set_all_paras(self, para):
        self.figTitle_cb.current(para['figTitle_cb'])
        self.figTitleFont.set(para['figTitleFont'])
        self.figTitleColor.set(para['figTitleColor'])
        self.figTitleColor_l.config(bg = self.figTitleColor.get())
        self.figTitleFontStyle.current(para['figTitleFontStyle'])
        self.figTitleFontWeight.current(para['figTitleFontWeight'])
        self.figTitleDecimal.set(para['figTitleDecimal'])
        self.scatterMarker_cb.current(para['self.scatterMarker_cb'])
        self.scatterMarker_size.set(para['self.scatterMarker_size'])
        self.scatter_cmap_cb.current(para['self.scatter_cmap_cb'])
        self.scatterLinewidth.set(para['self.scatterLinewidth'])
        self.scatterEdgeColor.set(para['self.scatterEdgeColor'])
        self.scatterEdgeColor_l.config(bg = self.scatterEdgeColor.get())
        self.scatteralpha.set(para['self.scatteralpha'])
        self.figAxisTickLabels.current(para['self.figAxisTickLabels'])
        self.figAxisTickColor.set(para['self.figAxisTickColor'])
        self.figAxisTickColor_l.config(bg = self.figAxisTickColor.get())
        self.figAxisFontSize.set(para['self.figAxisFontSize'])
        self.FigAxisFontWeight.current(para['self.FigAxisFontWeight'])
        self.colorbarTitle_cb.current(para['self.colorbarTitle_cb'])
        self.colorbarTitleFont.set(para['self.colorbarTitleFont'])
        self.colorbarTitleColor.set(para['self.colorbarTitleColor'])
        self.colorbarTitleColor_l.config(bg = self.colorbarTitleColor.get())
        self.colorbarTitleFontStyle.current(para['self.colorbarTitleFontStyle'])
        self.colorbarTitleFontWeight.current(para['self.colorbarTitleFontWeight'])
        self.colorbarTitleDecimal.set(para['self.colorbarTitleDecimal'])
        self.colorbarTicksFont.set(para['self.colorbarTicksFont'])
        self.colorbarTicksColor.set(para['self.colorbarTicksColor'])
        self.colorbarTicksColor_l.config(bg = self.colorbarTicksColor.get())
        self.colorbarTicksFontStyle.current(para['self.colorbarTicksFontStyle'])
        self.colorbarTicksFontWeight.current(para['self.colorbarTicksFontWeight'])
        self.colorbar_ticknum.set(para['self.colorbar_ticknum'])
        self.colorbar_tickdecimal.set(para['self.colorbar_tickdecimal'])

        self.on_set_colorbar_ticknum()
        self.on_set_colorbar_ticks('')
        self.on_set_colorbar_title('')
        self.on_set_axis('')
        self.canvas.set_fig_tick_color(self.figAxisTickColor.get())
        self.on_set_axis_fontsize()
        self.on_set_axis_font('')
        self.on_set_scatter('')
        self.on_set_title('')



if __name__ == '__main__':
    main()
