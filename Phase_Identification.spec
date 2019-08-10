# -*- mode: python ; coding: utf-8 -*-

block_cipher = None


a = Analysis(['Phase_Identification.py'],
             pathex=['C:\\Users\\AI-PC2\\Dropbox\\PythonProgram\\phase identification\\v1.03'],
             binaries=[],
             datas=[],
             hiddenimports=['pymatgen'],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          [],
          exclude_binaries=True,
          name='Phase_Identification',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               upx_exclude=[],
               name='Phase_Identification')
