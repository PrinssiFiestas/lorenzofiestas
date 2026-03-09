# Quantifying Clipping Softness

We present a formal description of clipping functions and a method to analyze their softness mostly audio applications (guitar electronics, audio DSP, etc.) in mind. We also present the smoothest clipping function, the Blunter, and report the results of an experiment showing that it is indeed the smoothest function given our description of clipping smoothness.

## Introduction

Clipping is a fundamental concept in signal processing. In high fidelity applications it is an undesirable artifact of limited headroom and/or failed gain staging, but it can also be an intentional creative effect like in guitar electronics or some music production gear. Either way, the clipping softness has major implications how it is perceived. 

There are multiple studies about non-linear distortions in audio that include some analysis of hard and soft clippers. Some focus on detecting these kinds of distortions TODO(ref), others focus on how these distortions are percieved TODO(ref). However, these studies only use soft clippers as a part of their study, which is not directly about softness. In other words, these studies have not studied clipping softness itself in detail. 

Hard clipping is commonly described as follows: once a signal reaches some threshold it cannot exceed that threshold and will be abruptly cut as shown in figure TODO. There is not much ambiguity regarding to this type of clipping. However, a soft clipper is commonly described as a type of clipping where the signal level may keep increasing after the threshold is reached when increasing the input signal level as shown in figure TODO. However, there are few ambiguities in this definition of soft clipping: the threshold of clipping, the upper limit of clipping, and how the signal transforms from the threshold to to the limit. Many clippers do not have well defined threshold nor they have a well defined limit like $\arctan$. Even if they do, it is still unclear how abruptly the clipper reaches from the threshold to the limit. 

Furthermore, the value for the hypothetical threshold and limit changes as the gain of the input signal changes and/or the gain of the output signal changes. All real world systems have these parameters, often given by the designer (like guitar amplifier gain and volume controls) of the system, but sometimes they are implicit to the system. For example, an implicit output gain could be given by the choice of components in an electronic circuit and implicit input gain could be given by the loudness of a singer singing into a microphone. This leads to yet another question: how would you compare the clipping softness of systems with varying input and output gain characteristics?

Our model deals with the threshold and limit ambiguities by analyzing the second derivative of the clipping functions instead of analyzing some hypothetical thresholds and limits. The second derivative describes exactly how abruptly the changes in the input signal change with increasing input signal levels. We will also present methods to normalize input and output gains to enable meaningful comparison of different clipper functions. 

## Definitions

A **clipping function** $f$ shall be any function that is non-linear, differentiable, and monotonically increasing. Clipping is a form of wave shaping, so it must be non-linear by definition. Monotonicity rules out wave folding effects, the function's output must not change when increasing input beyond it's limits. Additionally, $f'$ shall be unimodal (bell shaped) and nonnegative for all real inputs. This means that $f$ must be a Sigmoid-shadped function. 

For any meaningful analysis the clipping function must be normalized. For any clipping function $f$, a **normalized clipping function** is defined as
$$
f_1(x) = A_\text{out} f(A_\text{in} x),
$$
where $A_\text{in}$ is the **input gain** and $A_\text{out}$ is the **output gain**. Normalization is discussed later in more detail.

Clipping hardness $H_f$ and softness $S_f$ of any given clipping function can be defined as
$$
\begin{align*}
H_f	&= \max(|f_1''(x)|) \\
S_f	&= \frac{1}{H_f}.
\end{align*}
$$
The maximum absolute value of the second derivate describes how abruptly the change of a signal changes. It is  analogous to acceleration in kinematics. We only care about it's magnitude. Using $\max$ is a deliberate simplification of the model; only the largest local extreme is considered regardless of side of the $x$ axis or number of local extrema. Real world clippers may be (and commonly are) asymmetric, and they might have multiple local extrema, which might be the case when composing clippers. We think that the simplification is justified: it can be expected that the sharpest edge of the clipping function dominates the abruptness of change in harmonic content. We also expect our model to be predominantly used for individual clippers that are usually unimodal instead of multi-modal composed clippers. We will also simplify the study further by focusing on symmetric clippers for brevity. 

When measuring hardness, it might be a good idea to limit the domain of $f$ to $|x| \le A_\text{in}^{-1}X$, where $X$ is some sensible constant for any given measurement and $A_\text{in}^{-1}$ keeps comparisons fair between other clippers. This is because many real world clippers might start as diverging soft clippers, but would have hard bounds when signal level gets very high. This could be the case for an OTA based amplifier: it starts as $\arctan$ at very low voltage level, but will hard clip at rails voltage, which can very high TODO(ref). If the full domain would be considered, then an OTA based clipper would be considered as a hard clipper. In fact, most systems have some hard clipping limit. In electronics, this is usually rails voltage, and in digital domain, this would be 0 dBFS TODO(ref). 

If $g(x) = h(kx)$, where $k$ is constant, then the chain rule gives us
$$
\begin{align*}
g'(x)  &= k h'(k x) \\
g''(x) &= k^2 h''(k x),
\end{align*}
$$
which allows us to determine hardness in terms of unnormalized clippers like so:
$$
\begin{equation}
H_f = A_\text{out} A_\text{in}^2 \max(|f''(A_\text{in} x)|). \label{hardness}
\end{equation}
$$

Symmetric clippers can be categorized in three categories:

- **Bounded** clippers cannot increase their output once some limit is reached. In other words, bounded clippers are piece-wise functions that have zero derivative beyond any given signal level limit.
- **Converging** clippers have a limit when signal level approaches infinity.
- **Diverging** clippers do not converge. Output signal level can be increased indefinitely. 

## Hard Clipper and Quadratic Soft Clipper

Our model is already powerful enough to do analysis of **hard clipper** $h$. Hard clipper is a special case that does not need to be normalized to determine it's hardness and softness, so we will set it's input and output gains to one. We only need to consider the other side of the waveform for this analysis, we will use the positive side. A hard clipper will be linear until a threshold $T$ is reached after which the output stays constant. We will set this threshold to one. Then, a positive side hard clipper can be described as
$$
h_+(x) = \begin{cases}
		x, & x < 1 \\
		1, & x \ge 1.
	\end{cases}
$$
A hard clipper is not differentiable, and thus, not a valid clipping function on it's own. However, we can approximate it using a **quadratic soft clipper** $s$, which also has a clipping threshold, but it has a variable knee size $k \in (0, 1]$. A knee with zero size would be equivalent of not having a knee at all, which would be hard clipping. This soft clipper is linear below $T - k$, constant above $T + k$, and uses quadratic spline $P$ to interpolate smoothly between $T - k$ to $T + k$. The resulting function is a valid clipping function, however we are only using it to analyze hard clipping, so we will ignore normalization. Then, a positive side soft clipper can be described as
$$
\begin{align*}
P(x) &= ax^2 + bx + c \\
a    &= -\frac{1}{4k} \\
b    &= \frac{1}{2} + \frac{1}{2k} \\
c    &= \frac{1}{2} - \frac{1}{4k} - \frac{1}{4}k \\
s_+(x) &= \begin{cases}
		x,		& x < 1 - k \\
		P(x),	& 1 - k \le x < 1 + k \\
		1,		& 1 + k \le x.
	\end{cases}
\end{align*}
$$
It is trivial to see that the maximum of the second derivative of the soft clipper is completely determined by the spline. We can also see that 
$$
H_{s+} = \max(-s_+''(x)) = \max(-a) = \frac{1}{4k},
$$
so the hardness of $s$ is completely determined by $k$ and the limit of hardness and softness of the soft clipper as the knee size approaches to hard clipping is
$$
\begin{align*}
H_h &= \lim_{k \to 0+} \frac{1}{4k} = \infty \\
S_h &= \lim_{k \to 0+} \frac{1}{H_h} = 0,
\end{align*}
$$
which seems rather intuitive.

The analysis for negative side would be identical of course. However, it should be noted that asymmetrical hard clipping will always have a softness of zero, regardless of clipping thresholds of either side. In fact, the other side may not be clipped at all and the result is still zero. This may seem confusing and like it could undermine the usefulness of the model. And indeed, fully asymmetrical (one side linear) clipping will have a very distinct sound from symmetrical clipping. However, both asymmetrical and symmetrical hard clipping have an important property: once a threshold is reached (doesn't matter which one or both), the sound is immediately notably distorted. The abruptness of the clipping is what softness is measuring, a complete description of tonal characteristics of any given clipping function is outside of the scope of this study.

While we only needed to consider simplified unipolar hard clipper and soft clipper, their complete descriptions can be useful for DSP or other purposes. So for completeness, the full generic description of asymmetric hard clipper and quadratic soft clipper is as follows:
$$
\begin{align*}
h(x) &= \begin{cases}
		T_-, & x < T_- \\
		x,   & T_- \le x < T_+ \\
		T_+, & T_+ \le x
	\end{cases} \\

P_+(x) &= -\frac{1}{4k_+}x^2 
			+ \left( \frac{1}{2} + \frac{T_+}{2k_+} \right)x 
			+ \left( -\frac{T_+^2}{4k_+}+\frac{T_+}{2}-\frac{k_+}{4} \right) \\

P_-(x) &= \frac{1}{4k_-}x^2 
			+ \left( \frac{1}{2} - \frac{T_-}{2k_-} \right)x 
			+ \left( \frac{T_-^2}{4k_-}+\frac{T_-}{2}+\frac{k_-}{4} \right) \\

s(x) &= \begin{cases}
		T_-,     & x \le T_- - k_- \\
		P_-(x), & T_- - k_- < x \le T_- + k_- \\
		x,		& T_- + k_- < x < T_+ - k_+ \\
		P_+(x),	& T_+ - k_+ \le x < T_+ + k_+ \\
		T_+,	& T_+ + k_+ \le x,
	\end{cases}
\end{align*}
$$
where $T_- < 0$, $T_+ > 0$, $k_- \in (0, -T_-]$, and $k_+ \in (0, T_+]$. Symmetric hard and soft clippers are simpler:
$$
\begin{align*}

h(x) &= \begin{cases}
		x, & |x| < T \\
		T \, \text{sign}(x), & |x| \ge T
	\end{cases} \\

P(x) &= -\frac{1}{4k} 
		+ \left( \frac{1}{2} + \frac{T}{2k} \right)x
		+ \left( -\frac{T^2}{4k}+\frac{T}{2}-\frac{k}{4} \right) \\

s(x) &= \begin{cases}
		x, & |x| < T - k \\
		\text{sign}(x)P(|x|), & T - k \le |x| < T + k \\
		T\,\text{sign}(x), & T + k \le |x|,
	\end{cases}

\end{align*}
$$
where $T > 0$ and $k \in (0, T]$. 

## Normalization

The input gain controls the amount of clipping distortion. Input gain affects the output level, but output gain does not affect the amount of distortion, so input gain must be normalized before output gain normalization. Clipping result to harmonic distortion, so input gain will be normalized by setting it to a value such that measuring the **total harmonic distortion** (**THD**) of the clipping functions results to some normalized THD value. The THD of a clipping function will be measured by feeding a sinusoid to the clipper and computing the resulting Fourier series. A generic method of computing THD from Fourier coefficients is as follows:
$$
\begin{align*}
a_n &= \frac{2}{T} \int\limits_0^T x(t)\cos \left( \frac{2\pi}{T}nt \right) \,dt \\
b_n &= \frac{2}{T} \int\limits_0^T x(t)\sin \left( \frac{2\pi}{T}nt \right) \,dt \\
\text{THD}_f &= \sqrt{ \frac{\sum_{n=2}^{\infty} (a_n^2 + b_n^2)}{a_1^2 + b_1^2} }
\end{align*}
$$
where $2\pi/T$ is the fundamental frequency, $a_n$ and $b_n$ are the Fourier coefficients, and $n \in \N$ TODO(ref). Again, to measure the amplitudes for our THD measurement, we need to pass a sinusoid to our clipper, so in our case
$$
\begin{align*}
a_n &= 0 \\

b_n &= \frac{2}{T} \int\limits_0^T 
	f \left( A_{\text{in}} \sin \left( \frac{2\pi}{T}t \right) \right) 
		\sin \left( \frac{2\pi}{T}nt \right) \,dt \\

\text{THD}_f &= \frac{\sqrt{\sum_{n=2}^{\infty} b_n^2}}{b_1}.
\end{align*}
$$
We passed a sine to our clipper without a cosine component, so we know that $a_n = 0$. It should also be noted that symmetric clippers will not produce any even harmonics TODO(ref). 

The value of THD normalization will affect softness. Consider bounded clippers: given a periodic input, large amounts of input gain would make the output to converge to a square wave with well defined amplitude. But for diverging clippers (like $\arctan$), the output does not necessarily resemble a square wave as closely with large amounts of input gain making it sound smoother. With lower gains, however, $\arctan$ has more noticeable clipping threshold, which is described well by the extreme of the second derivative. We will be focusing on more modest input gains (e.g. potentially used by mixing engineers and semi-clean guitar tones) in this study.

The output gain controls the overall volume. It does not change the clipping characteristics, but the hardness (the second derivative) is directly proportional to it, so it must be normalized. It will be normalized by total power of the clipping function given some signal, which is commonly described by **root mean square** (**RMS**):
$$
\begin{equation}
\text{RMS} = \sqrt{ \frac{1}{t_1 - t_0} \int_{t_0}^{t_1} x(t)^2 \,dx } \label{rms}
\end{equation}
$$

We must choose an input signal for the measurement. It might be tempting to use a sinusoid, since that is what we needed to use to measure and normalize input gain, but the probelm with that is that real world audio is rarely just a pure sinusoid. Furthermore, passing $\sin(t) \in [-1, 1]$ will only only consider $f$ in a limited domain of $[-1, 1]$ ignoring anything beyond this domain. Consider clippers $\arctan(x)$ and $\arctan(h(x))$. If the input signal is limited to $[-1, 1]$, then (depending on THD normalization value) these clippers might result in an identical output gain normalization value. The hard clipping on the latter clipper would be completely ignored.

We need a signal that is roughly an average of all signals in some sense. A good candidate could be **Gaussian noise**, which has a **probability mass function** that follows the normal distribution. The **probability mass** describes how likely it is for a sample to get a specific value TODO(ref). This is important for us, because we need heuristics to determine how our clipping function would transform any given input values to output values on average. Since we cannot know our input signals, a probabilistic approach seems appropriate.

TODO(proper refs to this paragraph) Gaussian noise does have one huge issue for practical measurements: we would need to generate a huge amount of samples of it in order to converge. This could be done using any psuedo-random number generator with uniform distribution and [Box-Muller transform](https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform), but it would require huge amount of processing before it gets useful. Luckily, we don't need Gaussian noise, we just need anything that will give us a similar probability mass. It turns out that sampling the [quantile function](https://en.wikipedia.org/wiki/Quantile_function) of any given distribution enough times at regular intervals will yield the corresponding probability mass TODO(ref?). This means that as our signal we can use the quantile function of a Gaussian called the probit function, which can be computed using
$$
\text{probit}(t) = \sqrt{2} \text{erf}^{-1}(2t - 1),
$$
where $t \in (0, 1)$ and $\text{erf}^{-1}$ is the inverse of the error function. So finally, using $\eqref{rms}$, we get our output gain normalization:
$$
\begin{align}
\text{RMS}_f   &= \sqrt{ \int_0^1 f(A_\text{in} \text{probit}(t))^2 \,dt } \label{f_rms} \\
A_{\text{out}} &= \frac{1}{\text{RMS}_f} \label{out_gain}
\end{align}
$$

A great property of probit is that $\lim_{t\to 0} \text{probit}(t) = -\infty$ and $\lim_{t\to 1} \text{probit}(t) = \infty$. This means that the clipping function will considered in it's full domain, which is especially useful for composed clippers. Note that this can be useful even if we limit the domain of $f$ for hardness measurement, because this way any hard limits ignored by hardness measurement like rails voltages will be accounted for to some extent: hard limit decreases $\text{RMS}_f$, which increases $A_\text{out}$ eventually increasing $H_f$. 

## The Blunter

There exists a symmetric clipper that is smoother than any other symmetric clipper for a range of THD normalization values, which we will call **the Blunter**. We will be referring to it quite a lot, so it worth defining and naming it. The unnormalized Blunter is defined as 
$$
\begin{align*}
B(x) &= \begin{cases}
		2x - |x|x,      & |x| \le 1 \\
		\text{sign}(x), & |x| \gt 1
	\end{cases} \\
	&= \begin{cases}
		-1,       & x \lt -1  \\
		2x + x^2, & -1 \le x \lt 0 \\
		2x - x^2, & 0 \le x \le 1 \\
		1,        & 1 \lt x.
	\end{cases}
\end{align*}
$$
The normalized Blunter is
$$
B_1(x) = A_{B\text{out}} B(A_{B\text{in}} x).
$$
The Blunter is equivalent to our quadratic soft clipper when knee $k = T$ the only difference being normalization constants, so again, it's hardness is determined by the polynomial. Using $\eqref{hardness}$ and $|(x - 2x^2)''| = 2$, the hardness of the Blunter is
$$
H_B = 2 A_{B\text{out}} A_{B\text{in}}^2.
$$
If the domain of $f$ is limited to sufficiently low ranges and the THD normalization value is sufficiently low, then the second derivative of the Blunter is constant in the full domain. Otherwise, it is a step function. For our analysis, we will set the normalized THD to be a value such that the input domain fits exactly in Blunter's full polynomial section. With this normalized input gain, for any other clipper to be smoother, they would have to have the magnitude of their second derivatives smaller than $H_B$ for all $x$. Considering that the second derivative filters out the linear component of the clipping function, it would most certainly indicate that either the input, the output gain, or both are unnormalized. This is a bit difficult to prove analytically, but it can be experimentally shown that Blunter is indeed the smoothest clipper.

## Finding the Softest Clipper

[This repository](https://github.com/PrinssiFiestas/soft-clipper-analysis) contains code for multiple experiments and tests for this study. The main experiment generates all potential symmetric clipping functions with given precision `BASE`. For each of the generated functions, a normalized input gain and output gain is calculated to finally find the hardness of the function. Finally, the function with minimum hardness is found. `f` and `f_*` refer to clipping function lookup-tables. 

### Counter

An algorithm was developed that generates all potential clipping functions given a discrete precision of `BASE`. The basic idea is based on a counter: take `BASE` number of digits and start counting in that `BASE`. The generated sequence of numbers will be represent the positive side of a clipping function as a lookup table. By counting all numbers, we can ensure that each clipping function has in fact been generated. However, this naïve approach would have a time complexity of $O(\text{n}^\text{n})$, where $n = \text{BASE}$, so we need to find a way of skipping as many counts as possible. Our counting algorithm (starting from the *leftmost* digit) can be described with the following steps:

1. Knowing that the first derivative of a valid clipping function must be greater than or equal to zero, each time we increment a digit in the middle to a value that is greater than the digit on it's right side, we can duplicate the incremented digit to all of the digits on the right side (flush). 

`TODO some nice figure`

2. Also knowing that the first derivative is decreasing and cannot go below zero, we can skip all increments from the right that would increase the derivative from zero to one.

`TODO some other nice figure`

3. The next few functions can be obtained by incrementing and flushing the next digits on the right by using the same reasoning. The index for flushed digit can be cached to keep track where to flush next. Incrementing and flushing can be done as long as the digit is smaller than `BASE`.

`TODO more figures`

4. Since we are conceptually counting numbers here, once a digit equals `BASE`, the digit from the left must be incremented. However, the first derivative is known to be decreasing, we can only increment the leftmost digit of a segment with same derivative–increasing any digit on the right side would increase the derivative, so find where the derivative changes and increment that.

`TODO one more figure`

5. If the first digit equals `BASE`, then we are done. Otherwise, go to step one.

This algorithm only generates the positive side of the clipper lookup table. To generate the full table, it can easily be duplicated to the negative size with sign flipped. However, to preserve symmetry and monotonicity, an element has to be prepended to the positive side that always has zero value and counting should be done with digits ranging from one to `BASE` instead of zero to `BASE-1`. Code for generating next function in sequence is called `f_next()`, which can be found in [shared.h](https://github.com/PrinssiFiestas/soft-clipper-analysis/blob/main/src/shared.h). It has been verified to find all valid function tables by comparing it's result to naïve counter.

The precision of the generated tables is horrific at this point. Not only our lookup table consists of small integers, but the derivative also decreases in discrete steps. This means that the second derivative would consist of large spikes at these steps and zeroes otherwise, so we must smooth out the steps. 

`TODO figures of clipping functions before and after filtering, and same for second derivatives.`

### Filter

To smooth out the discrete steps, we had to process the clipper lookup table with a smoothing filter. The filtering had three major requirements:

- Good step response: the filter should preserve the clippers overall shape (no ringing).
- Good stopband attenuation: the derivatives are extremely sensitive to high frequencies.
- Zero-phase: `f[0]` must be zero.

The first two requirements are somewhat conflicting, but a good compromise was found by using a single pole IIR low-pass filter with a relatively low cutoff. Being somewhat heavy handed with the cutoff was justified by the fact than any clipper with hard edges could not be the smoothest, although we must be careful not to filter too much, which would make all functions look identical. Being single pole, the overall shape of the clipper was preserved well, and low cutoff gave reasonably good attenuation at high frequencies. To keep it zero phase, the clipper would be duplicated, then both duplicates would be filtered, the first one from right to left, the other one from left to right. Then results were added together for the final zero-phase result. As an added bonus, being IIR, the step response allows generating very good converging clippers. 

Any low-pass filter will ruin the first samples it processes, so we had to extrapolate our clippers. We chose to do quadratic extrapolation by finding the first and second differing samples from the edges to estimate first and second derivatives at the edges. This implicitly assumes non-zero first derivative, which unfortunately slightly reduced the generators capability to generate bounded clippers, but it considerably improved it's capability to generate converging and diverging clippers, so it was worth it. 

### Normalization

Input gain was normalized by finding the input gain value that matched our normalized THD value. We chose a value such that $$A_{B\text{in}} \approx 1$$, which was about 2.22559 %. This is the upper limit where Blunter should be the smoothest. We observed that [secant method](TODO) gave us really good approximations very fast (less than three iterations on average). The DFTs for THD calculations were calculated using fixed point integers and pre-calculated tables of sines of frequencies of harmonics to improve computation speed. 

To find the good initial guesses for secant method, we plotted THD as function of input gain of large number of generated clipper functions. The first guess would be simply the input gain that on average gives the normalized result. For second guess, we noted that input gain cannot be negative because THD is calculated from squared coefficients. This allowed us to find a minimum point where $\text{THD} \approx 0$. Having our first evaluated value at the first guess and the average minimum point, we could get the next estimate. 

`TODO THD scatter plot`

Output gain normalization was trivial using $\eqref{f_rms}$ and $\eqref{out_gain}$.

The filtered generator was tested by testing if it actually finds a diverging clipper, converging clipper, and a bounded clipper by finding the generated normalized functions with minimal differences from the three functions. We chose $\arctan$, a scaled and shifted logistic function, and of course the Blunter. Figure TODO shows these differences in base of TODO. As we can see, the generated functions match very well for the most part, but the extrapolation adds a little bit of noise at the ends. This, however, was not very significant, and the matching greatly improves when increasing `BASE`.

### Hardness

The final part was to compute the second difference of the clipper and find it's minimum (the second derivatives of positive side are negative). Then we finally get the hardness of the function using $\eqref{hardness}$. 

### Results

For $$\text{BASE} = 100$$, a total of 1 642 992 567 generated functions were analyzed in four hours on Intel i7-8750H CPU @ 2.20 GHz (GPU was also used, but with very little performance gains due to the serial nature of the problem). The function with smallest hardness was the 98 581 013th generated function with a softness of approximately 0.382396. Then, a hard coded lookup table representing the Blunter was generated and it was compared against the found function. The mean of the absolute differences of lookups of normalized Blunter and the smoothest found was 0.00504009, which is 0.405966 % relative to normalized Blunter's highest value (which is also the Blunter's output gain normalization value since $B(1) = 1$). This confirms to a reasonable accuracy the smoothest function generated does in fact represent the Blunter. Figure TODO shows a plot of the absolute differences. 

`TODO absolute differences plot`

Blunter's softness was measured to be approximately 0.405966, which is considerably higher than what was measured from the generated function. This is expected; our generator generated the functions based on low precision discrete derivatives and second derivatives. Even after filtering, these discrete steps would still show in the generated function as spikes. However, since Blunter has a constant second derivative, we expect to have many spikes in the second derivative that are spread out as evenly as possible. Figure TODO shows the second derivative of the generated function, where you can clearly see these spikes. While they are indeed very evenly spread out, they will nonetheless increase the measured hardness. 

`TODO generated second derivative plot`

It is also worth noting that our generator made the function symmetric by fixing the zeroth element to zero and mirroring the function. This gives zero second difference at $f[0]$, which is what we also see in the plot. Also, the IIR filtering would somewhat gradually decrease the magnitude of the second derivative to zero at the end of the generated domain. It should be noted that the second derivative is very sensitive to these sort of inaccuracies, but we got a reasonably good quality second derivatives and a very precise result anyway.

## Future Work

While it is expected that the constant second derivative makes the Blunter the smoothest for all THD normalization values below ours, our experiment only showed that this is the case in the upper limit. It is also expected that the Blunter is the smoothest clipper when including asymmetric clippers (if it is the smoothest on one side, why would the other one be any different?), but again, our experiment ignored those to keep computation times sensible. 

We justified the simplification of simply using $\max$ by assuming that the sharpest edge of the clipping function would dominate the abruptness of change in harmonic content. While we thing that this is a reasonable assumption, it needs to be verified, especially since asymmetric clippers produce even harmonics that are less offensive to humans TODO(ref).

The magnitude of the second derivative was chosen to be the measure of hardness, because it was simple and a reasonably good indicator of change in higher order harmonic content in a distorted signal. However, this correlation between hardness and change in higher order harmonics was not rigorously verified. 

## Conclusion

We presented a method to quantify and analyze clipping softness to address the lack of work that solely focus on clipping softness. We defined clipping hardness and softness mathematically and used the definition to analyze hard clipper and verified that it has zero softness following intuition. We then discussed how input and output gains are normalized in detail to enable meaningful comparisons of clippers. We also presented the Blunter, a quadratic soft clipper, which we claimed to be the smoothest clipper given our model. The claim was backed with an experiment that showed that if we generate all potential clippers and find the smoothest one, the generated smoothest clipper will in fact be the Blunter. 