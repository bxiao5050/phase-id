from matplotlib.figure import Figure
from matplotlib import cm
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk
import matplotlib.pyplot as plt

from tkinter import *
from tkinter import ttk
import pandas as pd
import numpy as np
try:
    from coords_canvas_ang import Coords_canvas, Buffer
    from xrangeDrag_ang import XRangeDrag
    from publication_angleMaximumPeak import Publication_angleMaximumPeak
except:
    from menu.coords_canvas_ang import Coords_canvas, Buffer
    from menu.xrangeDrag_ang import XRangeDrag
    from menu.publication_angleMaximumPeak import Publication_angleMaximumPeak

class ShowAngleMaximumPeak(Frame):
    def __init__(self, master, data):
        super().__init__(master)
        self.data = data
        self.coords = pd.read_csv('coords.txt', header = 0, index_col = 0)
        self.plotedLines = [] #plotted lines

        f_wafer = Frame(self)
        f_canvas = Frame(self)
        f_angpeak = Frame(self)

        f_wafer.grid(row = 0, column = 0, sticky = 'nw', padx = (5,5), pady = (5,5))
        f_canvas.grid(row = 0, column = 1, sticky = 'nw', padx = (5,5), pady = (5,5))
        f_angpeak.grid(row = 1, column = 1, sticky = 'nw', padx = (5,5), pady = (5,5))

        self.wafer_sel_var = IntVar()
        self.wafer_sel_var.set(0)
        wafer_sel=Checkbutton(f_wafer, text = 'select MA', variable = self.wafer_sel_var, onvalue=1, offvalue=0, command=self._wafer_sel)
        self.wafer = Coords_canvas(f_wafer)# wafer
        self.wafer_buffer = Buffer(f_wafer)# wafer fack


        fig = Figure(figsize=(7, 3.5), dpi=100)
        self.canvas = FigureCanvasTkAgg(fig, master=f_canvas)
        self.ax = fig.add_subplot(111)
        #initialize plot
        self._plot()

        toolbar = NavigationToolbar2Tk(self.canvas, f_canvas)
        toolbar.update()
        self.xRange = XRangeDrag(f_canvas, color = 'green',ax = self.ax)
        b_update = Button(f_canvas, text = 'refresh', command=self.on_update)

        wafer_sel.grid(row = 0, column =0, pady = (5,5), sticky = 'n')
        self.wafer_buffer.grid(row = 1, column =0, pady = (5,5), sticky = 'n')

        self.canvas.get_tk_widget().pack()
        b_update.pack()

        #angle peak pena
        Button(f_angpeak, text = 'angle of maximum peak intensity', command = self.plot_scatter).pack()


    def on_publication(self, ww):
        ww.destroy()
        w = Toplevel(self)
        w.title('set figure for publication')
        c = self.pub_para['c']
        ax = self.pub_para['ax']
        fig = self.pub_para['fig']
        cbar = self.pub_para['cbar']
        cax = self.pub_para['cax']
        Publication_angleMaximumPeak(w,  c, ax,fig, cbar, cax).pack()



    def plot_scatter(self):
        #angel maximum peak
        w = Toplevel(self)

        fig2 = Figure(figsize=(7.5,6), dpi=100)
        canvas_angpeak = FigureCanvasTkAgg(fig2, master=w)
        ax_angpeak = fig2.add_subplot(111)
        canvas_angpeak.get_tk_widget().pack()

        Button(w, text = 'figure for publication', command = lambda w = w:self.on_publication(w)).pack()

        x = self.data.iloc[:,0]
        ran = self.xRange.getRangeV()
        range_idx = np.where(np.logical_and(x>=ran[0], x<=ran[1]))[0]

        w.title('Plot angle of maximum peak intensity')

        yrange_max = []
        self.pub_para = {}

        if self.wafer_sel_var.get() ==0: #342
            for pos in range(1, 343):
                y = self.data.iloc[:,pos]
                # print(np.argmax(y[range_idx]))
                yrange_max.append(x[np.argmax(y[range_idx])])
            cax = ax_angpeak.scatter(self.coords['x'], self.coords['y'], c = yrange_max, cmap = 'jet', s = 100)

        else:
            clicked_pos = np.array(self.wafer.get_clicked_index())
            for pos in clicked_pos:
                y = self.data.iloc[:,pos]
                yrange_max.append(x[np.argmax(y[range_idx])])
            ax_angpeak.scatter(self.coords['x'], self.coords['y'], color = 'lightgray', s = 10)
            cax = ax_angpeak.scatter(self.coords['x'].to_numpy()[clicked_pos-1], self.coords['y'].to_numpy()[clicked_pos-1], c = yrange_max, cmap = 'gist_rainbow_r', s = 100)
        cbar = fig2.colorbar(cax, ax = ax_angpeak)
        ax_angpeak.set_xlabel('x-coordinate[mm]')
        ax_angpeak.set_ylabel('y-coordinate[mm]')
        ax_angpeak.set_title('angle of maximum peak intensity (' + str(ran[0]) + ' - ' + str(ran[1]) + r' 2${\Theta}$ [°])',fontsize=12)
        canvas_angpeak.draw()

        self.pub_para.clear()
        self.pub_para['c'] = np.array(yrange_max)
        self.pub_para['ax'] =  ax_angpeak
        self.pub_para['fig'] =   fig2
        self.pub_para['cbar'] =    cbar
        self.pub_para['cax'] =   cax





    #plot selected XRD on self.canvas
    def _plot(self):
        if len(self.plotedLines) != 0:
            for plotl in self.plotedLines:
                plotl.remove()
                del plotl

            self.plotedLines.clear()
        x = self.data.iloc[:,0]

        if self.wafer_sel_var.get() ==0:
            for pos in range(1, 343):
                y = self.data.iloc[:,pos]
                self.plotedLines.append(self.ax.plot(x,y)[0])
        else:
            clicked_pos = self.wafer.get_clicked_index()
            for pos in clicked_pos:
                y = self.data.iloc[:,pos]
                self.plotedLines.append(self.ax.plot(x,y)[0])

        self.canvas.draw()



    def on_update(self):
        self._plot()





    def _wafer_sel(self):
        if self.wafer_sel_var.get():
            self.wafer_buffer.grid_forget()
            self.wafer.grid(row = 1, column =0, pady = (5,5), sticky = 'n')
        else:
            self.wafer.grid_forget()
            self.wafer_buffer.grid(row = 1, column =0, pady = (5,5), sticky = 'n')







def main():
    root = Tk()
    data = pd.read_csv('XRD_export.csv')
    app = ShowAngleMaximumPeak(root, data)
    app.pack()

    root.mainloop()

if __name__ == '__main__':
    main()


