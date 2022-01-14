import pandas as pd
import numpy as np

import glob
import os
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk
from tkinter import *
import matplotlib
from matplotlib.figure import Figure
from matplotlib.widgets import RectangleSelector



class Coords_canvas(Frame):
    '''show canvas in scatter
    '''
    def __init__(self, master):
        super().__init__(master)
        coords = pd.read_csv('coords.txt', header = 0, index_col = 0)
        self.coords = coords
        self.width = 4000
        self.x, self.y = coords.iloc[:,0], coords.iloc[:,1]

        self.b_clear = Button(self, text = 'clear selections', fg = 'blue', command = self._on_clear)
        self.b_clear.pack()

        fig = Figure(figsize=(3.5, 3.5))
        self.canvas = FigureCanvasTkAgg(fig, master=self)  # A tk.DrawingArea.
        self.ax = fig.add_subplot(111)
        self.ax.set_xticks([])
        self.ax.set_xticklabels([])
        self.ax.set_yticks([])
        self.ax.set_yticklabels([])
        self.canvas.get_tk_widget().pack(fill='both', expand=1)
        # toolbar = NavigationToolbar2Tk(self.canvas, self)
        # toolbar.update()
        # self.ax.invert_yaxis()
        self.ax.scatter(self.x, self.y, marker = 's', linewidths = 2)# plot all the coords

        self.clicked_xy=[]
        self.plot_clicked = []


        self.cid1 = self.canvas.mpl_connect('button_press_event', self.on_click)
        # #__________________uncomment when multi-mouse selection needed______________
        self.RS = RectangleSelector(self.ax, self.line_select_callback,
                                               drawtype='box', useblit=True,
                                               button=[1, 3],  # don't use middle button
                                               minspanx=5, minspany=5,
                                               spancoords='pixels',
                                               interactive=False)

    #return clicked positions
    def get_clicked(self):
        return list(set(self.clicked_xy))

    def get_clicked_index(self):
        res = []
        # print(self.get_clicked())
        for cli in self.get_clicked():
            a = self.coords.index[(self.coords['x'] == cli[0]) & (self.coords['y'] == cli[1])].tolist()[0]
            res.append(a)
        return res
        # print(res)



    def _on_clear(self):
        for line in self.plot_clicked:
            line.remove()
        self.clicked_xy.clear()
        self.plot_clicked.clear()
        self.canvas.draw()


    def on_click(self, event):
        if event.inaxes!=self.ax: return
        self.get_click_xy(event.xdata, event.ydata)

        # print(self.get_clicked_index())


    # return clicked x, y
    def get_click_xy(self, xdata, ydata):
        index_x = np.abs(self.x-xdata) < self.width/2
        index_y = np.abs(self.y-ydata) < self.width/2
        list1 = self.x[index_x].index
        list2 = self.y[index_y].index

        #get the common index from x and y index
        index = list(set(list1).intersection(list2))

        if len(index): #find commen value between two arrays
            click_x, click_y = self.x.loc[index].iat[0], self.y.loc[index].iat[0]
            if (click_x, click_y) in self.get_clicked(): # click again then remove
                self.clicked_xy.remove((click_x, click_y))
            else:
                self.clicked_xy.append((click_x, click_y))

        self.updata_canvas()

    def line_select_callback(self, eclick, erelease):
        'eclick and erelease are the press and release events'
        x1, y1 = eclick.xdata, eclick.ydata
        x2, y2 = erelease.xdata, erelease.ydata

        # self.clicked_xy = []
        for x, y in zip(self.x, self.y):
            if x> min(x1, x2) and x < max(x1, x2) and y > min(y1, y2) and y< max(y1, y2):
                self.clicked_xy.append((x,y))

        self.updata_canvas()
        # return clicked_xy

    def updata_canvas(self):
        #clear all highlights
        for line in self.plot_clicked:
            line.remove()
        self.plot_clicked.clear()

        x = [x for x, y in self.clicked_xy]
        y = [y for x, y in self.clicked_xy]
        line, = self.ax.plot(x, y,linestyle='none', marker='s', markeredgecolor="orange",markersize = 7, markerfacecolor='red',markeredgewidth =2)
        self.plot_clicked.append(line)
        self.canvas.draw()




class Buffer(Frame):
    def __init__(self,master):
        super().__init__(master)
        coords = pd.read_csv('coords.txt', header = 0, index_col = 0)
        self.coords = coords
        self.width = 4000
        self.x, self.y = coords.iloc[:,0], coords.iloc[:,1]

        self.b_clear = Button(self, text = 'clear selections', fg = 'blue')
        self.b_clear.pack()

        fig = Figure(figsize=(3.5, 3.5))
        self.canvas = FigureCanvasTkAgg(fig, master=self)  # A tk.DrawingArea.
        self.ax = fig.add_subplot(111)
        self.ax.set_xticks([])
        self.ax.set_xticklabels([])
        self.ax.set_yticks([])
        self.ax.set_yticklabels([])
        self.canvas.get_tk_widget().pack(fill='both', expand=1)
        # toolbar = NavigationToolbar2Tk(self.canvas, self)
        # toolbar.update()
        # self.ax.invert_yaxis()
        self.ax.scatter(self.x, self.y, marker = 's', linewidths = 2, color = 'gray')# plot all the coords






def main():
    root = Tk()
    app = Buffer(root)
    # app = Coords_canvas(root)
    app.pack()
    app.mainloop()

if __name__=='__main__':
    main()
