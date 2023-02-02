First, install some dependencies and do our imports:

```
!pip3 install numpy scipy umap-learn soundfile wav2clip
```

```
import os
import numpy
import soundfile
import scipy.signal
import wav2clip
import ipywidgets
import umap
from tqdm.auto import tqdm
```

Next, let's pick a subdirectory with audio files to embed:
```
# Alternatively, simply set it to the desired subdirectory
w = ipywidgets.Dropdown(options=glob.glob("./*/"))
w
```


We assume there is a list of files to embed (named samples.txt). If not, this can be replaced with reading the relevant filenames directly (with os.listdir() for example).
```
f = w.value # Replace with just f = <subdirectory> if desired here instead
with open(os.path.join(f, "samples.txt")) as infile:
    files = [os.path.join(f, file) for file in infile.read().splitlines()]
    
print("Will embed %d files." % len(files))
```

First, we want to get useful high-dimensional embeddings. We'll use the Wav2CLIP model for this, just due to it's broad utility and simple API.
```
def embed_file(file, model):
    y, sr = soundfile.read(file) # Read file
    if len(y.shape) > 1:
        y = y.mean(axis=1) # Make mono if needed
    audio = scipy.signal.resample(y, int((len(y)/sr) * 16000)).astype(numpy.float32) # Resample to 16kHz for Wav2CLIP input
    return wav2clip.embed_audio(audio, model) # Return embedding
```

Actually run the embedding function over the files:
```
model = wav2clip.get_model()
embeddings = [embed_file(file, model) for file in tqdm(files)]
```

Now, we want to project these embeddings into two dimensions for visualization. We use the well-known UMAP algorithm, but you can subtitute some other manifold learning approach or another dimensionality reduction technique.
```
all_embeddings = numpy.vstack([x[0] for x in embeddings])
t = umap.UMAP(
    n_components=2,
    min_dist=0.1,
    a=0.05,
    b=0.8,
    spread=10
)
```

Save output so we can use it in the frontend. That's it!
```
coords = t.fit_transform(all_embeddings)
numpy.savetxt(os.path.join(f, "coords.txt"), coords, fmt="%.8f")
```